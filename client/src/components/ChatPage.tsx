import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Brain, Calculator, FlaskConical, ScrollText, BookOpen } from "lucide-react";
import type { WebWorkerMLCEngine } from "@mlc-ai/web-llm";
import { SYSTEM_PROMPT } from "../lib/engine-config";
import {
  SUBJECT_PROMPTS,
  SUBJECT_META,
  LESSONS,
  type Subject,
} from "../lib/subjects";

const SUBJECT_ICONS: Record<string, any> = {
  Calculator,
  FlaskConical,
  ScrollText,
  BookOpen
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPageProps {
  engine: WebWorkerMLCEngine;
}

export default function ChatPage({ engine }: ChatPageProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subjectParam = searchParams.get("subject") as Subject | null;
  const lessonId = searchParams.get("lesson");

  // Resolve subject & lesson context
  const subject =
    subjectParam && subjectParam in SUBJECT_META ? subjectParam : null;
  const lesson = lessonId ? LESSONS.find((l) => l.id === lessonId) : null;
  const meta = subject ? SUBJECT_META[subject] : null;

  // Build the system prompt with subject context
  const systemPrompt = useMemo(() => {
    let prompt = subject ? SUBJECT_PROMPTS[subject] : SYSTEM_PROMPT;
    if (lesson) {
      prompt += `\n\nThe student is currently studying: "${lesson.title}" (Week ${lesson.week}, Chapter ${lesson.chapter} of ${lesson.totalChapters}). Tailor your questions and hints to this topic.`;
    }
    return prompt;
  }, [subject, lesson]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

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
        { role: "system" as const, content: systemPrompt },
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

  const SubjectIcon = meta ? SUBJECT_ICONS[meta.icon] : Brain;

  return (
    <div className="flex flex-col fixed inset-0 h-svh w-full bg-primary z-[100] overflow-hidden">
      {/* Top App Bar */}
      <header className="flex items-center px-4 py-3 border-b border-border bg-white shrink-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-surface transition-colors"
        >
          <ArrowLeft size={20} className="text-text" />
        </button>
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-text text-base font-bold leading-tight line-clamp-1 text-center px-2">
            {lesson ? lesson.title : subject ? `${meta!.label} Tutor` : "AI Tutor"}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            {subject && meta && (
              <span className={`text-[10px] font-bold uppercase tracking-widest ${meta.color}`}>
                {meta.label}
              </span>
            )}
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-[10px] font-bold text-text-subtle uppercase tracking-tighter">Local Engine</span>
          </div>
        </div>
        <div className="w-10" />
      </header>

      {/* Chat Area */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-surface/30 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="flex min-h-full items-center justify-center p-8">
            <div className="flex flex-col items-center text-center gap-4 max-w-sm">
              <div className={`p-6 rounded-3xl ${meta ? meta.bgColor : 'bg-accent/5'}`}>
                {SubjectIcon && <SubjectIcon size={48} className={meta ? meta.color : 'text-accent'} />}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {subject ? `Hello! I'm your ${meta!.label} Tutor` : "Ready to learn?"}
                </h3>
                <p className="text-sm text-text-subtle leading-relaxed">
                  {lesson
                    ? `I'm here to help you with "${lesson.title}". Ask me a question to get started!`
                    : "Ask me anything! I'll guide you step-by-step using the Socratic method."}
                </p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                msg.role === "user"
                  ? "bg-accent text-white rounded-tr-none shadow-sm"
                  : "bg-white text-text rounded-tl-none border border-border shadow-sm"
              }`}
            >
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                {msg.content || (
                   <span className="flex items-center gap-2 text-text-subtle italic">
                     <span className="flex space-x-1">
                        <span className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1 h-1 bg-accent rounded-full animate-bounce"></span>
                      </span>
                      Thinking...
                   </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {/* Extra spacer at bottom of list */}
        <div className="h-2" />
      </main>

      {/* Bottom Input Area */}
      <footer className="bg-white border-t border-border p-4 shrink-0 z-10">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <div className="flex-1 relative group">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              placeholder="Ask a question..."
              className="w-full bg-surface border border-border rounded-2xl px-4 py-3 pr-12 text-[15px] focus:outline-none focus:border-accent focus:bg-white transition-all resize-none max-h-32 disabled:opacity-50 min-h-[48px]"
            />
            <button
              onClick={handleSend}
              disabled={isGenerating || !input.trim()}
              className="absolute right-2 bottom-2 size-8 bg-accent text-white rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 shadow-sm"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        {/* Mobile safe area spacing */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </footer>
    </div>
  );
}
