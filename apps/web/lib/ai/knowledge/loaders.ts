import path from 'node:path';
import fs from 'node:fs/promises';

import matter from 'gray-matter';

import {
  Audience,
  KnowledgeCategory,
  KnowledgeEntry,
  KnowledgeFrontMatter,
  KnowledgeMetadata,
  KnowledgeQueryOptions,
  KnowledgeStatus,
  KnowledgeTag,
  Locale,
} from './types';

const KNOWLEDGE_ROOT = path.join(process.cwd(), 'data', 'knowledge');

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  'brand',
  'policies',
  'products',
  'shipping',
];

interface CachedKnowledgeEntry {
  mtimeMs: number;
  entry: KnowledgeEntry;
}

const fileCache = new Map<string, CachedKnowledgeEntry>();
let cachedEntries: KnowledgeEntry[] | null = null;

const toArray = <T>(value: T | T[] | undefined, fallback: T[] = []): T[] => {
  if (value === undefined) {
    return [...fallback];
  }

  return Array.isArray(value) ? value : [value];
};

const normaliseAudience = (audiences?: Audience[]): Audience[] => {
  if (!audiences || audiences.length === 0) {
    return [];
  }

  return Array.from(new Set(audiences.map((audience) => audience.trim())));
};

const normaliseKeywords = (keywords?: KnowledgeTag[]): KnowledgeTag[] => {
  if (!keywords || keywords.length === 0) {
    return [];
  }

  return Array.from(new Set(keywords.map((keyword) => keyword.trim().toLowerCase())));
};

const parseFrontMatter = (
  frontMatter: KnowledgeFrontMatter,
  sourcePath: string,
  expectedCategory?: KnowledgeCategory,
): KnowledgeMetadata => {
  const category = frontMatter.category ?? expectedCategory;
  const { slug, title, summary } = frontMatter;

  if (!slug) {
    throw new Error(`Knowledge entry at ${sourcePath} is missing a 'slug' field.`);
  }

  if (!category) {
    throw new Error(`Knowledge entry at ${sourcePath} is missing a 'category' field.`);
  }

  if (expectedCategory && category !== expectedCategory) {
    throw new Error(
      `Knowledge entry at ${sourcePath} declares category '${category}' but is stored in '${expectedCategory}'.`,
    );
  }

  if (!title) {
    throw new Error(`Knowledge entry at ${sourcePath} is missing a 'title' field.`);
  }

  if (!summary) {
    throw new Error(`Knowledge entry at ${sourcePath} is missing a 'summary' field.`);
  }

  const locale = frontMatter.locale ?? 'en-US';
  const locales = toArray<Locale>(frontMatter.locales, [locale]);
  const status: KnowledgeStatus = frontMatter.status ?? 'published';
  const updated = frontMatter.updated ? new Date(frontMatter.updated) : undefined;

  return {
    slug,
    category,
    title,
    summary,
    locale,
    locales,
    status,
    updated,
    audiences: normaliseAudience(frontMatter.audiences),
    keywords: normaliseKeywords(frontMatter.keywords),
  };
};

const buildCacheKey = (filePath: string): string => filePath.replace(KNOWLEDGE_ROOT, '');

const loadKnowledgeFile = async (
  filePath: string,
  category: KnowledgeCategory,
): Promise<KnowledgeEntry> => {
  const cacheKey = buildCacheKey(filePath);
  const stat = await fs.stat(filePath);

  const cached = fileCache.get(cacheKey);
  if (cached && cached.mtimeMs === stat.mtimeMs) {
    return cached.entry;
  }

  const raw = await fs.readFile(filePath, 'utf8');
  const parsed = matter(raw, {
    excerpt: true,
    excerpt_separator: '\n\n',
  });

  const metadata = parseFrontMatter(
    parsed.data as KnowledgeFrontMatter,
    filePath,
    category,
  );

  const entry: KnowledgeEntry = {
    metadata,
    content: parsed.content.trim(),
    raw,
    excerpt: parsed.excerpt?.trim(),
    sourcePath: filePath,
  };

  fileCache.set(cacheKey, {
    mtimeMs: stat.mtimeMs,
    entry,
  });

  return entry;
};

const readCategoryEntries = async (
  category: KnowledgeCategory,
): Promise<KnowledgeEntry[]> => {
  const categoryDir = path.join(KNOWLEDGE_ROOT, category);
  let files: string[] = [];

  try {
    files = await fs.readdir(categoryDir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }

    throw error;
  }

  const markdownFiles = files.filter((file) => file.endsWith('.md'));

  const entries = await Promise.all(
    markdownFiles.map((file) => loadKnowledgeFile(path.join(categoryDir, file), category)),
  );

  return entries.sort((a, b) => a.metadata.slug.localeCompare(b.metadata.slug));
};

const loadAllEntries = async (forceReload = false): Promise<KnowledgeEntry[]> => {
  if (!forceReload && cachedEntries) {
    return cachedEntries;
  }

  const entriesByCategory = await Promise.all(
    KNOWLEDGE_CATEGORIES.map((category) => readCategoryEntries(category)),
  );

  const entries = entriesByCategory.flat();

  if (!forceReload) {
    cachedEntries = entries;
  } else {
    cachedEntries = [...entries];
  }

  return entries;
};

const matchesLocale = (entry: KnowledgeEntry, locale?: Locale): boolean => {
  if (!locale) {
    return true;
  }

  const { metadata } = entry;
  return metadata.locale === locale || metadata.locales.includes(locale);
};

const matchesAudience = (entry: KnowledgeEntry, audience?: Audience): boolean => {
  if (!audience) {
    return true;
  }

  return entry.metadata.audiences.includes(audience);
};

const matchesKeyword = (entry: KnowledgeEntry, keyword?: KnowledgeTag): boolean => {
  if (!keyword) {
    return true;
  }

  const normalised = keyword.trim().toLowerCase();
  return entry.metadata.keywords.includes(normalised);
};

const matchesStatus = (entry: KnowledgeEntry, status?: KnowledgeStatus): boolean => {
  if (!status) {
    return true;
  }

  return entry.metadata.status === status;
};

export const getKnowledgeEntries = async (
  options: KnowledgeQueryOptions = {},
): Promise<KnowledgeEntry[]> => {
  const { category, locale, audience, keyword, status, forceReload } = options;

  const entries = await loadAllEntries(forceReload);

  return entries.filter((entry) => {
    if (category && entry.metadata.category !== category) {
      return false;
    }

    if (!matchesStatus(entry, status ?? 'published')) {
      return false;
    }

    if (!matchesLocale(entry, locale)) {
      return false;
    }

    if (!matchesAudience(entry, audience)) {
      return false;
    }

    if (!matchesKeyword(entry, keyword)) {
      return false;
    }

    return true;
  });
};

export const getKnowledgeEntryBySlug = async (
  slug: string,
  options: Omit<KnowledgeQueryOptions, 'keyword'> = {},
): Promise<KnowledgeEntry | undefined> => {
  const entries = await getKnowledgeEntries({ ...options, forceReload: options.forceReload ?? false });

  return entries.find((entry) => entry.metadata.slug === slug);
};

export const clearKnowledgeCache = (): void => {
  cachedEntries = null;
  fileCache.clear();
};

