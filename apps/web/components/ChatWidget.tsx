"use client";

import { FormEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

type Message = {
  id: string;
  author: "bot" | "user";
  content: string;
  timestamp: Date;
};

type ChatStatus = "idle" | "streaming" | "error";

const BOT_NAME = "Forestal MT Assistant";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "welcome",
      author: "bot",
      content:
        "Hello! I'm here 24/7 to help with product questions, shipping, and returns. Ask me anything about our Batana Oil, Stingless Bee Honey, or Traditional Herbs.",
      timestamp: new Date()
    }
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const windowId = useId();

  const toggle = () => setIsOpen((prev) => !prev);

  // Clean up any ongoing request when component unmounts or chat closes
  useEffect(() => {
    if (!isOpen && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setStatus("idle");
    }
  }, [isOpen]);

  const streamChatResponse = useCallback(async (message: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setStatus("streaming");

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationId: conversationId || undefined,
        }),
        signal: controller.signal,
      });

      // Extract conversation ID from response headers
      const newConversationId = response.headers.get('X-Conversation-Id');
      if (newConversationId && newConversationId !== conversationId) {
        setConversationId(newConversationId);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessageId = `bot-${crypto.randomUUID()}`;
      let assistantContent = '';

      // Create initial assistant message
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        author: "bot",
        content: "",
        timestamp: new Date()
      }]);

      // Stream the response
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        // Update the assistant message with accumulated content
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: assistantContent }
            : msg
        ));
      }

      setStatus("idle");
    } catch (error) {
      console.error('Chat API error:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, don't show error message
        return;
      }

      // Add error message
      const errorMessage: Message = {
        id: `error-${crypto.randomUUID()}`,
        author: "bot",
        content: "I'm experiencing technical difficulties right now. Please try again in a moment, or contact our support team directly for immediate assistance.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setStatus("error");
      
      // Reset to idle after a delay
      setTimeout(() => setStatus("idle"), 3000);
    } finally {
      abortControllerRef.current = null;
    }
  }, [conversationId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || status === "streaming") {
      return;
    }

    const userMessage: Message = {
      id: `user-${crypto.randomUUID()}`,
      author: "user",
      content: trimmed,
      timestamp: new Date()
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");

    // Stream the AI response
    await streamChatResponse(trimmed);
  };

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const ariaLabel = useMemo(
    () => (isOpen ? "Close customer support chat" : "Open customer support chat"),
    [isOpen]
  );

  const isInputDisabled = status === "streaming";
  const submitButtonText = status === "streaming" ? "Sending..." : "Send";

  return (
    <div className="chat-widget__container">
      {isOpen && (
        <section
          className="chat-widget__window"
          aria-label="AI support chat window"
          id={windowId}
        >
          <header className="chat-widget__header">
            <div className="chat-widget__title">
              <span>AI Support</span>
              <span>{BOT_NAME}</span>
            </div>
            <button
              type="button"
              className="chat-widget__close"
              onClick={toggle}
              aria-label="Close chat window"
            >
              ×
            </button>
          </header>
          <div className="chat-widget__body" role="log" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-widget__message chat-widget__message--${message.author}`}
              >
                <div className="chat-widget__bubble">
                  {message.content}
                  {status === "streaming" && message.author === "bot" && message.content === "" && (
                    <span className="chat-widget__typing">...</span>
                  )}
                </div>
                <time className="chat-widget__timestamp" dateTime={message.timestamp.toISOString()}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>
            ))}
          </div>
          <form className="chat-widget__composer" onSubmit={handleSubmit}>
            <label htmlFor="chat-input" className="sr-only">
              Ask a question
            </label>
            <input
              id="chat-input"
              name="message"
              className="chat-widget__input"
              placeholder={isInputDisabled ? "AI is typing..." : "Type your question"}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              autoComplete="off"
              disabled={isInputDisabled}
              ref={inputRef}
            />
            <button 
              type="submit" 
              className="chat-widget__send" 
              disabled={!input.trim() || isInputDisabled}
            >
              {submitButtonText}
            </button>
          </form>
        </section>
      )}
      <button
        type="button"
        className="chat-widget__button"
        onClick={toggle}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls={isOpen ? windowId : undefined}
      >
        {isOpen ? "Close chat" : "Need help?"}
      </button>
    </div>
  );
}
