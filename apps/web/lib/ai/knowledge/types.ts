export type KnowledgeCategory = 'brand' | 'policies' | 'products' | 'shipping';

export type KnowledgeTag = string;

export type Audience =
  | 'customers'
  | 'support'
  | 'marketing'
  | 'operations'
  | 'pr'
  | 'retail'
  | 'logistics'
  | (string & {});

export type Locale = string;

export type KnowledgeStatus = 'draft' | 'published';

export interface KnowledgeFrontMatter {
  slug: string;
  category: KnowledgeCategory;
  title: string;
  summary: string;
  locale?: Locale;
  locales?: Locale[];
  updated?: string;
  status?: KnowledgeStatus;
  audiences?: Audience[];
  keywords?: KnowledgeTag[];
}

export interface KnowledgeMetadata {
  slug: string;
  category: KnowledgeCategory;
  title: string;
  summary: string;
  locale: Locale;
  locales: Locale[];
  updated?: Date;
  status: KnowledgeStatus;
  audiences: Audience[];
  keywords: KnowledgeTag[];
}

export interface KnowledgeEntry {
  metadata: KnowledgeMetadata;
  content: string;
  raw: string;
  excerpt?: string;
  sourcePath: string;
}

export interface KnowledgeQueryOptions {
  category?: KnowledgeCategory;
  locale?: Locale;
  audience?: Audience;
  keyword?: KnowledgeTag;
  status?: KnowledgeStatus;
  forceReload?: boolean;
}

