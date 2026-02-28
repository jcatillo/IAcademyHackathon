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
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased overflow-hidden h-screen w-full flex flex-col relative">
      {/* Top App Bar */}
      <header className="flex items-center bg-surface-light dark:bg-surface-dark px-4 py-3 border-b-2 border-slate-900 dark:border-slate-700 sticky top-0 z-50">
        <button className="flex size-10 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">
            arrow_back
          </span>
        </button>
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">
            The Invisible Schoolhouse
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Local GPU Active
            </span>
          </div>
        </div>
        <button className="flex size-10 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">
            more_vert
          </span>
        </button>
      </header>

      {/* Offline Indicator Banner */}
      <div className="bg-slate-900 text-white dark:bg-slate-800 w-full py-1.5 px-4 flex justify-center items-center gap-2 shadow-sm relative z-40">
        <span className="material-symbols-outlined text-[16px]">wifi_off</span>
        <span className="text-xs font-semibold tracking-wide uppercase">
          Offline Mode Enabled
        </span>
      </div>

      {/* Chat Area */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6 pb-24 bg-background-light dark:bg-background-dark"
      >
        {messages.length > 0 && (
          <div className="flex justify-center my-4">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
              Today
            </span>
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-4 opacity-70">
              <div className="bg-primary aspect-square rounded-2xl border-4 border-slate-900 dark:border-slate-100 w-20 flex items-center justify-center shadow-neubrutalism">
                <span className="material-symbols-outlined text-white text-5xl">
                  psychology
                </span>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Socratic Tutor Ready
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">
                  Ask me a math or reading question! Try: "How do I solve 2x =
                  10?"
                </p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 group ${msg.role === "user" ? "items-end justify-end" : "items-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="bg-primary aspect-square rounded-lg border-2 border-slate-900 dark:border-slate-100 w-10 shrink-0 flex items-center justify-center shadow-neubrutalism-sm">
                <span className="material-symbols-outlined text-white text-xl">
                  psychology
                </span>
              </div>
            )}

            <div
              className={`flex flex-col gap-1 max-w-[85%] ${msg.role === "user" ? "items-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Socratic Tutor
                  </span>
                </div>
              )}

              {msg.role === "user" ? (
                <div className="bg-primary text-white p-3.5 rounded-2xl rounded-br-none shadow-md">
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              ) : (
                <>
                  {msg.content ? (
                    <div className="bg-white dark:bg-surface-dark border-2 border-slate-900 dark:border-slate-500 p-4 rounded-xl rounded-tl-none shadow-neubrutalism text-slate-900 dark:text-slate-100">
                      <p className="leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-surface-dark border-2 border-slate-900 dark:border-slate-500 p-3 rounded-xl rounded-tl-none shadow-neubrutalism text-slate-900 dark:text-slate-100 flex items-center gap-3 w-fit">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Thinking locally...
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        {/* Spacer for input area scrolling */}
        <div className="h-4"></div>
      </main>

      {/* Bottom Input Area */}
      <footer className="bg-surface-light dark:bg-surface-dark border-t-2 border-slate-900 dark:border-slate-700 p-4 pb-8 sticky bottom-0 z-50">
        <div className="flex gap-3 items-end relative">
          <button className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl p-3 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center justify-center h-[52px] w-[52px]">
            <span className="material-symbols-outlined">
              add_photo_alternate
            </span>
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              placeholder={
                isGenerating ? "AI is thinking..." : "Type your answer..."
              }
              className="w-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3.5 pr-12 text-base focus:outline-none focus:border-primary focus:ring-0 resize-none overflow-hidden min-h-[52px] text-slate-900 dark:text-slate-100 placeholder-slate-400 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={isGenerating || !input.trim()}
              className="absolute right-2 bottom-2 bg-primary hover:bg-primary-dark text-white rounded-lg p-2 transition-colors flex items-center justify-center shadow-sm disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[20px]">
                send
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
