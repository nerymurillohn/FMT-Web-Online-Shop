export interface KnowledgeConfig {
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  locale: string;
}

export const DEFAULT_CHUNK_SIZE = 750;
export const DEFAULT_CHUNK_OVERLAP = 150;
export const DEFAULT_TOP_K = 5;
export const DEFAULT_LOCALE = 'en';

export const defaultKnowledgeConfig: KnowledgeConfig = {
  chunkSize: DEFAULT_CHUNK_SIZE,
  chunkOverlap: DEFAULT_CHUNK_OVERLAP,
  topK: DEFAULT_TOP_K,
  locale: DEFAULT_LOCALE,
};

export type SimilarityMetric = 'cosine';

export interface RetrieverOptions {
  chunkSize?: number;
  chunkOverlap?: number;
  topK?: number;
  locale?: string;
  tags?: string[];
}
