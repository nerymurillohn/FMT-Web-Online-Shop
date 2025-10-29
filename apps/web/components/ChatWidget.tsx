"use client";

import { FormEvent, useMemo, useState } from "react";

type Message = {
  id: string;
  author: "bot" | "user";
  content: string;
};

const BOT_NAME = "Forestal MT Assistant";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "welcome",
      author: "bot",
      content:
        "Hello! I'm here 24/7 to help with product questions, shipping, and returns. Ask me anything or let me know how I can guide your purchase."
    }
  ]);

  const toggle = () => setIsOpen((prev) => !prev);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const userMessage: Message = {
      id: `user-${crypto.randomUUID()}`,
      author: "user",
      content: trimmed
    };

    const acknowledgement: Message = {
      id: `bot-${crypto.randomUUID()}`,
      author: "bot",
      content:
        "Thanks for your message! Our AI-powered assistant will soon provide tailored answers once the knowledge base is connected."
    };

    setMessages((current) => [...current, userMessage, acknowledgement]);
    setInput("");
  };

  const ariaLabel = useMemo(
    () => (isOpen ? "Close customer support chat" : "Open customer support chat"),
    [isOpen]
  );

  return (
    <div className="chat-widget__container">
      {isOpen && (
        <section className="chat-widget__window" aria-label="AI support chat window">
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
          <div className="chat-widget__body">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-widget__message chat-widget__message--${message.author}`}
              >
                <div className="chat-widget__bubble">{message.content}</div>
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
              placeholder="Type your question"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="chat-widget__send" disabled={!input.trim()}>
              Send
            </button>
          </form>
        </section>
      )}
      <button type="button" className="chat-widget__button" onClick={toggle} aria-label={ariaLabel}>
        {isOpen ? "Close chat" : "Need help?"}
      </button>
    </div>
  );
}
