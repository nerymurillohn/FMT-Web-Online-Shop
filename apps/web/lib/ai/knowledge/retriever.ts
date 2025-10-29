import VectorStore, {
  EmbeddingProvider,
  KnowledgeDocument,
  RetrievedChunk,
  VectorStoreOptions,
} from './vector-store';
import {
  DEFAULT_CHUNK_OVERLAP,
  DEFAULT_CHUNK_SIZE,
  DEFAULT_LOCALE,
  DEFAULT_TOP_K,
  RetrieverOptions,
} from './config';

export interface RetrieveContextOptions extends RetrieverOptions {
  documents: KnowledgeDocument[];
  store?: VectorStore;
  provider?: EmbeddingProvider;
  dbPath?: string;
  persistence?: VectorStoreOptions['persistence'];
}

function buildStore(options: RetrieveContextOptions): VectorStore {
  if (options.store) {
    return options.store;
  }
  return new VectorStore({
    provider: options.provider,
    dbPath: options.dbPath,
    persistence: options.persistence,
    chunkSize: options.chunkSize ?? DEFAULT_CHUNK_SIZE,
    chunkOverlap: options.chunkOverlap ?? DEFAULT_CHUNK_OVERLAP,
  });
}

export async function retrieveContext(
  query: string,
  options: RetrieveContextOptions,
): Promise<RetrievedChunk[]> {
  if (!options.documents?.length) {
    return [];
  }
  const store = buildStore(options);
  await store.upsert(options.documents);
  const topK = options.topK ?? DEFAULT_TOP_K;
  const locale = options.locale ?? DEFAULT_LOCALE;
  return store.similaritySearch(query, topK, {
    locale,
    tags: options.tags,
  });
}

export default retrieveContext;
