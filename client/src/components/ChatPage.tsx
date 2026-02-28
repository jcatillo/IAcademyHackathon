import { useState, useRef, useEffect } from "react";
import type { WebWorkerMLCEngine } from "@mlc-ai/web-llm";
import { SYSTEM_PROMPT } from "../lib/engine-config";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPageProps {
  engine: WebWorkerMLCEngine;
}

export default function ChatPage({ engine }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isGenerating) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsGenerating(true);

    try {
      // Build the full conversation with system prompt
      const chatMessages = [
        { role: "system" as const, content: SYSTEM_PROMPT },
        ...updatedMessages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ];

      // Stream the response token by token
      const stream = await engine.chat.completions.create({
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 256,
        stream: true,
      });

      let assistantContent = "";
      // Add an empty assistant message that we'll update in place
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        assistantContent += delta;
        // Update the last message in place
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: assistantContent,
          };
          return copy;
        });
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${err?.message ?? "Generation failed."}`,
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gray-950 text-white">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-gray-800 px-4 py-3">
        <span className="text-2xl">🏫</span>
        <div>
          <h1 className="text-sm font-bold">The Invisible Schoolhouse</h1>
          <p className="text-xs text-green-400">
            ● AI running on your device — fully offline
          </p>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-gray-600 space-y-2">
              <p className="text-4xl">💡</p>
              <p className="text-sm">Ask me a math or reading question!</p>
              <p className="text-xs text-gray-700">
                Try: "How do I solve 2x = 10?"
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-gray-800 text-gray-100 rounded-bl-md"
              }`}
            >
              {msg.content || (
                <span className="inline-block animate-pulse text-gray-400">
                  Thinking...
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-800 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            placeholder={
              isGenerating ? "AI is thinking..." : "Type your question..."
            }
            className="flex-1 rounded-xl bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isGenerating || !input.trim()}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-40 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
