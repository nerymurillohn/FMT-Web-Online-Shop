import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import {
  DEFAULT_CHUNK_OVERLAP,
  DEFAULT_CHUNK_SIZE,
  DEFAULT_TOP_K,
} from './config';

export interface KnowledgeDocument {
  id?: string;
  content: string;
  title?: string;
  locale?: string;
  tags?: string[];
}

export interface KnowledgeChunk extends KnowledgeDocument {
  chunkId: string;
  documentId: string;
  position: number;
}

export interface RetrievedChunk extends KnowledgeChunk {
  similarity: number;
}

export interface EmbeddingProvider {
  embed(texts: string[]): Promise<number[][]>;
}

export interface VectorStoreOptions {
  provider?: EmbeddingProvider;
  dbPath?: string;
  persistence?: 'memory' | 'sqlite';
  chunkSize?: number;
  chunkOverlap?: number;
  vectorSize?: number;
}

const DEFAULT_VECTOR_SIZE = 256;

type StoredChunk = KnowledgeChunk & { vector: number[] };

type SQLiteStatements = {
  insert: any;
  selectAll: any;
  deleteByDoc: any;
};

type SQLiteBindings = {
  chunkId: string;
  documentId: string;
  content: string;
  locale?: string | null;
  tags?: string | null;
  position: number;
  vector: Buffer;
};

const SQLITE_TABLE = `CREATE TABLE IF NOT EXISTS knowledge_chunks (
  chunk_id TEXT PRIMARY KEY,
  document_id TEXT,
  content TEXT,
  locale TEXT,
  tags TEXT,
  position INTEGER,
  vector BLOB
)`;

const SQLITE_INDEX = `CREATE INDEX IF NOT EXISTS knowledge_chunks_document_locale ON knowledge_chunks(document_id, locale)`;

const SQLITE_INSERT = `REPLACE INTO knowledge_chunks (chunk_id, document_id, content, locale, tags, position, vector)
VALUES (@chunkId, @documentId, @content, @locale, @tags, @position, @vector)`;

const SQLITE_SELECT_ALL = `SELECT chunk_id as chunkId, document_id as documentId, content, locale, tags, position, vector FROM knowledge_chunks`;

const SQLITE_DELETE_BY_DOC = `DELETE FROM knowledge_chunks WHERE document_id = ?`;

function tryLoadBetterSqlite3(): any | null {
  try {
    const dynamicRequire = typeof require === 'function' ? require : undefined;
    if (!dynamicRequire) return null;
    return dynamicRequire('better-sqlite3');
  } catch (error) {
    return null;
  }
}

function normalizeTags(tags?: string[]): string[] {
  return (tags ?? []).map((tag) => tag.trim().toLowerCase()).filter(Boolean);
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function hashToken(token: string, vectorSize: number): number {
  const hash = crypto.createHash('sha1');
  hash.update(token);
  return hash.digest().readUInt32BE(0) % vectorSize;
}

function normalizeVector(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((acc, value) => acc + value * value, 0));
  if (norm === 0) {
    return vector;
  }
  return vector.map((value) => value / norm);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vector size mismatch');
  }
  let dot = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
  }
  return dot;
}

export function chunkText(
  content: string,
  chunkSize: number = DEFAULT_CHUNK_SIZE,
  chunkOverlap: number = DEFAULT_CHUNK_OVERLAP,
): string[] {
  if (chunkSize <= 0) {
    throw new Error('chunkSize must be a positive integer');
  }
  const tokens = tokenize(content);
  if (tokens.length === 0) {
    return [];
  }
  const step = Math.max(1, chunkSize - chunkOverlap);
  const chunks: string[] = [];
  for (let start = 0; start < tokens.length; start += step) {
    const slice = tokens.slice(start, start + chunkSize);
    if (slice.length === 0) {
      continue;
    }
    chunks.push(slice.join(' '));
    if (start + chunkSize >= tokens.length) {
      break;
    }
  }
  return chunks;
}

function encodeVector(vector: number[]): Buffer {
  const buffer = Buffer.allocUnsafe(vector.length * 8);
  vector.forEach((value, index) => {
    buffer.writeDoubleBE(value, index * 8);
  });
  return buffer;
}

function decodeVector(buffer: Buffer): number[] {
  const vector: number[] = [];
  for (let offset = 0; offset < buffer.length; offset += 8) {
    vector.push(buffer.readDoubleBE(offset));
  }
  return vector;
}

function prepareSQLite(dbPath: string): { database: any; statements: SQLiteStatements } | null {
  const BetterSqlite3 = tryLoadBetterSqlite3();
  if (!BetterSqlite3) {
    return null;
  }
  const resolvedPath = path.resolve(dbPath);
  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
  const database = new BetterSqlite3(resolvedPath);
  database.exec(SQLITE_TABLE);
  database.exec(SQLITE_INDEX);
  const statements: SQLiteStatements = {
    insert: database.prepare(SQLITE_INSERT),
    selectAll: database.prepare(SQLITE_SELECT_ALL),
    deleteByDoc: database.prepare(SQLITE_DELETE_BY_DOC),
  };
  return { database, statements };
}

export class VectorStore {
  private readonly provider?: EmbeddingProvider;

  private readonly persistence: 'memory' | 'sqlite';

  private readonly vectorSize: number;

  private readonly chunkSize: number;

  private readonly chunkOverlap: number;

  private memoryStore = new Map<string, StoredChunk>();

  private sqlite: { database: any; statements: SQLiteStatements } | null;

  constructor(options: VectorStoreOptions = {}) {
    this.provider = options.provider;
    this.persistence = options.persistence ?? (options.dbPath ? 'sqlite' : 'memory');
    this.vectorSize = options.vectorSize ?? DEFAULT_VECTOR_SIZE;
    this.chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
    this.chunkOverlap = options.chunkOverlap ?? DEFAULT_CHUNK_OVERLAP;
    this.sqlite = null;

    if (this.persistence === 'sqlite' && options.dbPath) {
      this.sqlite = prepareSQLite(options.dbPath);
      if (!this.sqlite) {
        this.persistence = 'memory';
      }
    }
  }

  private getAllChunks(): StoredChunk[] {
    if (this.persistence === 'sqlite' && this.sqlite) {
      const { statements } = this.sqlite;
      const rows = statements.selectAll.all();
      return rows.map((row: SQLiteBindings) => ({
        chunkId: row.chunkId,
        documentId: row.documentId,
        content: row.content,
        locale: row.locale ?? undefined,
        tags: row.tags ? JSON.parse(row.tags) : undefined,
        position: row.position,
        vector: decodeVector(row.vector),
      }));
    }
    return Array.from(this.memoryStore.values());
  }

  private async embed(texts: string[]): Promise<number[][]> {
    if (this.provider) {
      return this.provider.embed(texts);
    }
    return texts.map((text) => this.fallbackEmbed(text));
  }

  private fallbackEmbed(text: string): number[] {
    const vector = new Array(this.vectorSize).fill(0);
    for (const token of tokenize(text)) {
      const index = hashToken(token, this.vectorSize);
      vector[index] += 1;
    }
    return normalizeVector(vector);
  }

  private saveChunk(chunk: StoredChunk): void {
    if (this.persistence === 'sqlite' && this.sqlite) {
      const { statements } = this.sqlite;
      const bindings: SQLiteBindings = {
        chunkId: chunk.chunkId,
        documentId: chunk.documentId,
        content: chunk.content,
        locale: chunk.locale ?? null,
        tags: chunk.tags ? JSON.stringify(normalizeTags(chunk.tags)) : null,
        position: chunk.position,
        vector: encodeVector(chunk.vector),
      };
      statements.insert.run(bindings);
    }
    this.memoryStore.set(chunk.chunkId, chunk);
  }

  private removeDocument(documentId: string): void {
    if (this.persistence === 'sqlite' && this.sqlite) {
      const { statements } = this.sqlite;
      statements.deleteByDoc.run(documentId);
    }
    for (const [key, chunk] of this.memoryStore.entries()) {
      if (chunk.documentId === documentId) {
        this.memoryStore.delete(key);
      }
    }
  }

  async upsert(documents: KnowledgeDocument[]): Promise<void> {
    if (!documents.length) {
      return;
    }
    const chunks = documents.flatMap((document) =>
      this.createChunksForDocument(document),
    );
    if (!chunks.length) {
      return;
    }
    const embeddings = await this.embed(chunks.map((chunk) => chunk.content));
    for (let index = 0; index < chunks.length; index += 1) {
      const chunk = chunks[index];
      const stored: StoredChunk = {
        ...chunk,
        vector: embeddings[index],
      };
      this.saveChunk(stored);
    }
  }

  private createChunksForDocument(document: KnowledgeDocument): KnowledgeChunk[] {
    const documentId = document.id ?? crypto.randomUUID();
    this.removeDocument(documentId);
    const tags = normalizeTags(document.tags);
    const chunks = chunkText(document.content, this.chunkSize, this.chunkOverlap);
    return chunks.map((chunk, index) => ({
      chunkId: `${documentId}:${index}`,
      documentId,
      content: chunk,
      title: document.title,
      locale: document.locale,
      tags,
      position: index,
    }));
  }

  private filterChunks(
    chunks: StoredChunk[],
    locale?: string,
    tags?: string[],
  ): StoredChunk[] {
    const normalizedTags = normalizeTags(tags);
    return chunks.filter((chunk) => {
      if (locale && chunk.locale && chunk.locale !== locale) {
        return false;
      }
      if (!normalizedTags.length) {
        return true;
      }
      const chunkTags = normalizeTags(chunk.tags);
      return normalizedTags.every((tag) => chunkTags.includes(tag));
    });
  }

  async similaritySearch(
    query: string,
    topK: number = DEFAULT_TOP_K,
    options: { locale?: string; tags?: string[] } = {},
  ): Promise<RetrievedChunk[]> {
    const allChunks = this.getAllChunks();
    if (!allChunks.length) {
      return [];
    }
    const [queryVector] = await this.embed([query]);
    const filteredChunks = this.filterChunks(allChunks, options.locale, options.tags);
    const results = filteredChunks
      .map((chunk) => ({
        chunk,
        similarity: cosineSimilarity(queryVector, chunk.vector),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .map(({ chunk, similarity }) => ({
        ...chunk,
        similarity,
      }));
    return results;
  }
}

export default VectorStore;
