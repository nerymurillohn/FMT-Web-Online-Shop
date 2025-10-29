import { NextRequest } from 'next/server';
import { z } from 'zod';

import conversationStore from '@/lib/ai/conversation-store';
import { getKnowledgeEntries } from '@/lib/ai/knowledge/loaders';
import retrieveContext from '@/lib/ai/knowledge/retriever';
import type { KnowledgeDocument } from '@/lib/ai/knowledge/vector-store';
import {
  ChatCompletionMessage,
  createOpenAIClient,
} from '@/lib/ai/providers/openai';

type KnowledgeEntry = Awaited<ReturnType<typeof getKnowledgeEntries>>[number];

const requestSchema = z.object({
  message: z.string(),
  conversationId: z.string().optional(),
});

function toKnowledgeDocument(entry: KnowledgeEntry): KnowledgeDocument {
  return {
    id: entry.metadata.slug,
    title: entry.metadata.title,
    content: entry.content,
    locale: entry.metadata.locale,
    tags: entry.metadata.keywords,
  };
}

function buildSystemPrompt(
  brandEntries: KnowledgeEntry[],
  policyEntries: KnowledgeEntry[],
): string {
  const basePrompt = [
    'You are the AI assistant for FMT, a sustainable smart home brand. Respond with friendly, transparent, and helpful guidance.',
    'Always align with the brand voice, reference the knowledge base for facts, and clearly communicate any uncertainties.',
  ];

  const brandSections = brandEntries
    .map(
      (entry) => `### ${entry.metadata.title}\n${entry.content}`,
    )
    .join('\n\n');
  if (brandSections) {
    basePrompt.push('Brand voice and positioning:\n' + brandSections);
  }

  const policySections = policyEntries
    .map(
      (entry) => `### ${entry.metadata.title}\n${entry.content}`,
    )
    .join('\n\n');
  if (policySections) {
    basePrompt.push('Key store policies:\n' + policySections);
  }

  basePrompt.push(
    'Use the provided conversation history and knowledge snippets to craft concise, factual answers. If the context does not cover a request, acknowledge the limitation and recommend contacting support when appropriate.',
  );

  return basePrompt.join('\n\n');
}

function buildContextMessage(
  chunks: Awaited<ReturnType<typeof retrieveContext>>,
  documentsById: Map<string, KnowledgeDocument>,
): string | undefined {
  if (!chunks.length) {
    return undefined;
  }

  const sections = chunks.map((chunk) => {
    const doc = documentsById.get(chunk.documentId);
    const sourceTitle = doc?.title ?? chunk.title ?? chunk.documentId;
    return `Source: ${sourceTitle}\n${chunk.content}`;
  });

  if (!sections.length) {
    return undefined;
  }

  return 'Relevant knowledge base excerpts:\n\n' + sections.join('\n\n');
}

export async function POST(request: NextRequest): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch (error) {
    console.error({
      event: 'api.chat.invalid_json',
      message: (error as Error).message,
    });
    return Response.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    console.error({
      event: 'api.chat.invalid_body',
      issues: parsed.error.flatten(),
    });
    return Response.json(
      { error: 'Invalid request body.', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const message = parsed.data.message.trim();
  if (message.length === 0) {
    return Response.json({ error: 'Message cannot be empty.' }, { status: 400 });
  }

  const client = createOpenAIClient();
  if (!client) {
    console.error({ event: 'api.chat.missing_provider_credentials' });
    return Response.json(
      { error: 'AI provider is not configured.' },
      { status: 503 },
    );
  }

  const conversationId = conversationStore.ensure(parsed.data.conversationId);

  try {
    const knowledgeEntries = await getKnowledgeEntries();
    const brandEntries = knowledgeEntries.filter(
      (entry) => entry.metadata.category === 'brand',
    );
    const policyEntries = knowledgeEntries.filter(
      (entry) => entry.metadata.category === 'policies',
    );
    const documents = knowledgeEntries.map(toKnowledgeDocument);
    const documentsById = new Map<string, KnowledgeDocument>();
    for (const document of documents) {
      if (document.id) {
        documentsById.set(document.id, document);
      }
    }

    const contextChunks = await retrieveContext(message, {
      documents,
    });

    const systemPrompt = buildSystemPrompt(brandEntries, policyEntries);
    const contextMessage = buildContextMessage(contextChunks, documentsById);

    conversationStore.append(conversationId, {
      role: 'user',
      content: message,
      createdAt: new Date(),
    });

    const historyMessages = conversationStore
      .get(conversationId)
      .slice(-20)
      .map<ChatCompletionMessage>((entry) => ({
        role: entry.role,
        content: entry.content,
      }));

    const messages: ChatCompletionMessage[] = [
      { role: 'system', content: systemPrompt },
      ...(contextMessage ? [{ role: 'system', content: contextMessage }] : []),
      ...historyMessages,
    ];

    const providerStream = await client.streamChatCompletion({ messages });
    const reader = providerStream.getReader();
    const decoder = new TextDecoder();
    let assistantReply = '';
    let assistantStored = false;

    const finaliseAssistantMessage = () => {
      if (assistantStored) {
        return;
      }
      assistantReply += decoder.decode();
      const trimmed = assistantReply.trim();
      if (trimmed.length > 0) {
        conversationStore.append(conversationId, {
          role: 'assistant',
          content: trimmed,
          createdAt: new Date(),
        });
      }
      assistantStored = true;
    };

    const stream = new ReadableStream<Uint8Array>({
      async pull(controller) {
        let result;
        try {
          result = await reader.read();
        } catch (streamError) {
          finaliseAssistantMessage();
          console.error({
            event: 'api.chat.stream.read_error',
            message: (streamError as Error).message,
            conversationId,
          });
          controller.error(streamError as Error);
          return;
        }

        const { value, done } = result;
        if (done) {
          finaliseAssistantMessage();
          controller.close();
          return;
        }

        if (value) {
          assistantReply += decoder.decode(value, { stream: true });
          controller.enqueue(value);
        }
      },
      cancel(reason) {
        finaliseAssistantMessage();
        reader.cancel(reason).catch((error) => {
          console.error({
            event: 'api.chat.stream.cancel_error',
            message: (error as Error).message,
            conversationId,
          });
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Conversation-Id': conversationId,
      },
    });
  } catch (error) {
    console.error({
      event: 'api.chat.unexpected_error',
      message: (error as Error).message,
      stack: (error as Error).stack,
      conversationId,
    });
    return Response.json(
      { error: 'An unexpected error occurred while processing the chat request.' },
      { status: 500 },
    );
  }
}
