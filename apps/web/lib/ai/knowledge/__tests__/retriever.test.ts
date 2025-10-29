import { describe, expect, it } from 'vitest';

import {
  chunkText,
  KnowledgeDocument,
  VectorStore,
} from '../vector-store';
import retrieveContext from '../retriever';

const SAMPLE_TEXT = `Shipping labels help customers send items back quickly. ` +
  `A prepaid label can simplify the return workflow for both the merchant and the buyer.`;

describe('knowledge retriever', () => {
  it('chunks long documents with overlap to preserve context', () => {
    const chunkSize = 10;
    const chunkOverlap = 2;
    const chunks = chunkText(SAMPLE_TEXT, chunkSize, chunkOverlap);
    expect(chunks.length).toBeGreaterThan(1);
    const tokens = chunks.map((chunk) => chunk.split(/\s+/));
    for (let index = 1; index < tokens.length; index += 1) {
      const previous = tokens[index - 1].slice(-chunkOverlap);
      const current = tokens[index].slice(0, chunkOverlap);
      expect(current).toEqual(previous);
    }
  });

  it('filters results by tags before ranking similarities', async () => {
    const documents: KnowledgeDocument[] = [
      {
        id: 'returns',
        content: 'Customers can request a return shipping label through the returns portal.',
        tags: ['support', 'returns'],
      },
      {
        id: 'billing',
        content: 'Invoices are generated automatically for all billing inquiries.',
        tags: ['support', 'billing'],
      },
    ];

    const results = await retrieveContext('How do I download my invoice?', {
      documents,
      tags: ['billing'],
      topK: 5,
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => result.documentId === 'billing')).toBe(true);
  });

  it('scores more relevant chunks higher than unrelated context', async () => {
    const documents: KnowledgeDocument[] = [
      {
        id: 'shipping',
        content: 'Shipping labels and carrier pickups can be scheduled directly in the dashboard.',
        tags: ['support', 'shipping'],
      },
      {
        id: 'returns',
        content: 'Return policies cover refunds, exchanges, and warranty claims for all purchases.',
        tags: ['support', 'returns'],
      },
    ];

    const store = new VectorStore();
    await store.upsert(documents);

    const results = await store.similaritySearch('What is the return policy?', 2);
    expect(results[0]?.documentId).toBe('returns');
    expect(results[0].similarity).toBeGreaterThan(results[1].similarity);
  });
});
