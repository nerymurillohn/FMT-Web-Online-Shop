import { randomUUID } from 'node:crypto';

export type ConversationRole = 'user' | 'assistant';

export interface ConversationMessage {
  role: ConversationRole;
  content: string;
  createdAt: Date;
}

class ConversationStore {
  private readonly conversations = new Map<string, ConversationMessage[]>();

  ensure(conversationId?: string): string {
    const id = conversationId ?? randomUUID();
    if (!this.conversations.has(id)) {
      this.conversations.set(id, []);
    }
    return id;
  }

  append(conversationId: string, message: ConversationMessage): void {
    const id = this.ensure(conversationId);
    const messages = this.conversations.get(id);
    if (!messages) {
      throw new Error(`Failed to access conversation '${id}' after initialization.`);
    }
    messages.push({ ...message });
  }

  get(conversationId: string): ConversationMessage[] {
    const messages = this.conversations.get(conversationId);
    if (!messages) {
      return [];
    }
    return messages.map((message) => ({ ...message }));
  }
}

export const conversationStore = new ConversationStore();

export default conversationStore;
