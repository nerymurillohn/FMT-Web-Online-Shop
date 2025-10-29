const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
const DEFAULT_OPENAI_BASE_URL = process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1';

export type ChatCompletionRole = 'system' | 'user' | 'assistant';

export interface ChatCompletionMessage {
  role: ChatCompletionRole;
  content: string;
}

export interface ChatCompletionStreamOptions {
  model?: string;
  temperature?: number;
  messages: ChatCompletionMessage[];
}

export interface OpenAIClientOptions {
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

interface OpenAIStreamChunk {
  choices?: Array<{
    delta?: {
      content?: string;
    };
  }>;
}

export class OpenAIClient {
  private readonly apiKey: string;

  private readonly model: string;

  private readonly baseUrl: string;

  constructor(options: OpenAIClientOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model ?? DEFAULT_OPENAI_MODEL;
    this.baseUrl = options.baseUrl ?? DEFAULT_OPENAI_BASE_URL;
  }

  async streamChatCompletion(
    options: ChatCompletionStreamOptions,
  ): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model ?? this.model,
        temperature: options.temperature ?? 0.2,
        stream: true,
        messages: options.messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OpenAI request failed with status ${response.status}: ${errorText}`,
      );
    }

    const body = response.body;
    if (!body) {
      throw new Error('OpenAI response did not include a readable stream.');
    }

    const reader = body.getReader();
    const decoder = new TextDecoder('utf-8');
    const encoder = new TextEncoder();
    let buffer = '';
    let isDone = false;

    const processBuffer = (
      controller: ReadableStreamDefaultController<Uint8Array>,
      flush = false,
    ): void => {
      const segments = buffer.replace(/\r\n/g, '\n').split('\n\n');
      buffer = segments.pop() ?? '';

      for (const segment of segments) {
        const trimmed = segment.trim();
        if (!trimmed) {
          continue;
        }
        const dataLines = trimmed
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.startsWith('data: '));

        for (const line of dataLines) {
          const payload = line.slice('data: '.length).trim();
          if (!payload) {
            continue;
          }
          if (payload === '[DONE]') {
            isDone = true;
            controller.close();
            return;
          }
          try {
            const parsed = JSON.parse(payload) as OpenAIStreamChunk;
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          } catch (error) {
            console.error({
              event: 'openai.stream.parse_error',
              message: (error as Error).message,
              payload,
            });
          }
        }
      }

      if (flush && buffer.trim()) {
        const remaining = buffer.trim();
        buffer = '';
        if (remaining.startsWith('data: ')) {
          const payload = remaining.slice('data: '.length).trim();
          if (payload === '[DONE]') {
            isDone = true;
            controller.close();
            return;
          }
          try {
            const parsed = JSON.parse(payload) as OpenAIStreamChunk;
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          } catch (error) {
            console.error({
              event: 'openai.stream.parse_error',
              message: (error as Error).message,
              payload,
            });
          }
        }
      }
    };

    return new ReadableStream<Uint8Array>({
      async pull(controller) {
        if (isDone) {
          controller.close();
          return;
        }

        const { value, done } = await reader.read();
        if (done) {
          processBuffer(controller, true);
          if (!isDone) {
            controller.close();
          }
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        processBuffer(controller);
      },
      cancel(reason) {
        reader.cancel(reason).catch((error) => {
          console.error({
            event: 'openai.stream.cancel_error',
            message: (error as Error).message,
          });
        });
      },
    });
  }
}

export const createOpenAIClient = (): OpenAIClient | null => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAIClient({ apiKey });
};

export default OpenAIClient;
