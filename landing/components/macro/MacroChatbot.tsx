"use client";

import { useState, useRef, useEffect } from "react";
import { BorderBeam } from "border-beam";
import { Send, MessageCircle, Dumbbell, Apple, ChevronDown, Check } from "lucide-react";
import { GradientText } from "./ui/GradientText";
import { Icon } from "./ui/Icon";
import { ThinkingOrb, useThinkingOrbState } from "./ui/ThinkingOrb";
import { sendChatMessage } from "@/lib/api";

type Mode = "workout" | "nutrition";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const DEMO_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hey! I'm Macro — your AI fitness & nutrition coach. How can I help you train smarter today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    role: "user",
    content: "Create a push-day workout for hypertrophy, 4 days/week, dumbbells only.",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: "3",
    role: "assistant",
    content: "Perfect. Here's a 4-day push/pull/legs/upper split optimized for dumbbells:\n\n**Day 1 — Push (Chest/Shoulders/Triceps)**\n• DB Bench Press: 3×8–10 @ RPE 8\n• Incline DB Press: 3×10–12\n• Standing DB Overhead Press: 3×8–10\n• DB Lateral Raises: 3×12–15\n• Overhead DB Tricep Extension: 3×10–12\n• DB Skull Crushers: 2×12–15\n\n**Day 2 — Pull (Back/Biceps)**\n• DB Rows (single-arm): 3×8–10\n• DB Pullover: 3×10–12\n• DB Reverse Flyes: 3×12–15\n• DB Hammer Curls: 3×10–12\n• DB Concentration Curls: 2×12–15\n\n**Day 3 — Legs**\n• DB Goblet Squats: 3×10–12\n• DB RDLs: 3×8–10\n• DB Bulgarian Split Squats: 3×8–10/leg\n• DB Calf Raises: 4×15–20\n\n**Day 4 — Upper (Full)**\n• DB Floor Press: 3×8–10\n• DB Renegade Rows: 3×8–10/side\n• DB Arnold Press: 3×10–12\n• DB Incline Flyes: 3×12–15\n• DB Zottman Curls: 3×10–12\n\nWant me to adjust volume, add progression schemes, or generate a nutrition plan to match?",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
];

export function MacroChatbot() {
  const [mode, setMode] = useState<Mode>("workout");
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { state: orbState, isVisible: orbVisible } = useThinkingOrbState(isStreaming, 600);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = inputValue.trim();
    if (!prompt || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsStreaming(true);

    try {
      const modePrefix = mode === "workout" ? "WORKOUT: " : "NUTRITION: ";
      const queryWithContext = prompt.toLowerCase().startsWith("workout") || prompt.toLowerCase().startsWith("nutrition")
        ? prompt
        : `${modePrefix}${prompt}`;

      const data = await sendChatMessage(queryWithContext);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "No response received.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to FitPilot API.";
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `⚠️ Connection Issue: ${errorMessage}\n\nPlease verify that the backend is running at http://localhost:8000.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  return (
    <BorderBeam
      size="md"
      colorVariant="ocean"
      strength={0.7}
      active={true}
      theme="dark"
      className="relative"
    >
      <div className="relative rounded-2xl glass-strong p-1 overflow-hidden">
        <div className="rounded-[14px] bg-black/60 backdrop-blur-2xl border border-white/10 overflow-hidden flex flex-col h-[580px] max-h-[85vh]">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <MessageCircle size={20} className="text-black" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Macro AI</h3>
                <p className="text-xs text-cyan-400 flex items-center gap-1">
                  <span className="relative">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  </span>
                  Online
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowModeMenu(!showModeMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/30 hover:bg-white/10 transition-all duration-200 text-sm font-medium"
                aria-expanded={showModeMenu}
                aria-haspopup="listbox"
              >
                <Icon 
                  icon={mode === "workout" ? Dumbbell : Apple} 
                  size={16} 
                  className="text-cyan-400" 
                />
                <span className="capitalize">{mode}</span>
                <ChevronDown size={14} className="text-white/50" />
              </button>

              {showModeMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowModeMenu(false)} 
                    aria-hidden="true"
                  />
                  <ul className="absolute right-0 top-full mt-2 w-40 rounded-xl glass-strong border border-white/10 py-2 shadow-lg z-20" role="listbox">
                    {(["workout", "nutrition"] as Mode[]).map((m) => (
                      <li key={m} role="option" aria-selected={mode === m}>
                        <button
                          onClick={() => { setMode(m); setShowModeMenu(false); }}
                          className={`w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm transition-colors ${
                            mode === m 
                              ? "bg-cyan-400/10 text-cyan-400" 
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Icon icon={m === "workout" ? Dumbbell : Apple} size={16} />
                          <span className="capitalize">{m}</span>
                          {mode === m && <Check size={16} className="text-cyan-400 ml-auto" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6" role="log" aria-live="polite" aria-label="Chat messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center">
                  {msg.role === "assistant" ? (
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center">
                      <MessageCircle size={16} className="text-cyan-400" aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-white/30" />
                    </div>
                  )}
                </div>
                <div className={`max-w-[75%] ${msg.role === "user" ? "text-right" : ""}`}>
                  <div className={`inline-block px-5 py-3 rounded-2xl ${msg.role === "user" ? "bg-gradient-to-br from-cyan-400 to-blue-600 text-black" : "bg-white/5 border border-white/10 text-white"}`}>
                    <p className="whitespace-pre-wrap text-base leading-relaxed">{msg.content}</p>
                  </div>
                  <p className="text-xs text-white/30 mt-1.5">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
            ))}

            {isStreaming && orbVisible && (
              <div className="flex gap-3" role="status" aria-live="polite">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center">
                  <ThinkingOrb state={orbState} size={20} speed={1.2} />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 max-w-[75%]">
                  <div className="flex items-center gap-2 text-cyan-400/80 text-sm">
                    <ThinkingOrb state={orbState} size={20} speed={1.2} />
                    <span>Macro is thinking…</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <footer className="p-4 border-t border-white/10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => { setInputValue(e.target.value); autoResize(e); }}
                  onKeyDown={handleKeyDown}
                  placeholder={mode === "workout" ? "Ask for a workout, exercise alternatives, progression help…" : "Ask for a meal plan, macro breakdown, recipe ideas…"}
                  className="w-full min-h-[56px] max-h-[200px] px-5 py-4 pr-16 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none font-sans text-base leading-relaxed"
                  disabled={isStreaming}
                  aria-label={`Message Macro AI (${mode} mode)`}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isStreaming}
                  className="absolute right-3 bottom-3 p-2.5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-black hover:from-cyan-300 hover:to-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed aria-busy={isStreaming}"
                  aria-label="Send message"
                >
                  <Send size={18} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>
              <p className="text-xs text-white/30 text-center">
                Press <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-white/50 font-mono text-[11px]">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-white/50 font-mono text-[11px]">Shift+Enter</kbd> for new line
              </p>
            </form>
          </footer>
        </div>
      </div>
    </BorderBeam>
  );
}