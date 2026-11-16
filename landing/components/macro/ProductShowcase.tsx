"use client";

import { useState } from "react";
import { 
  Dumbbell, 
  Utensils, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  XCircle,
  TrendingUp,
  Target,
  Zap,
  ArrowRight,
  Flame
} from "lucide-react";
import { ScrollReveal, StaggerContainer } from "./ui/ScrollReveal";
import { GradientText } from "./ui/GradientText";
import { Icon } from "./ui/Icon";
import { ThinkingOrb } from "./ui/ThinkingOrb";

type Tab = "workout" | "nutrition" | "chat";

const TAB_CONFIG = {
  workout: { label: "Workout Planner", icon: Dumbbell, color: "cyan" },
  nutrition: { label: "Nutrition Planner", icon: Utensils, color: "green" },
  chat: { label: "AI Assistant", icon: MessageCircle, color: "purple" },
} as const;

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<Tab>("workout");

  return (
    <section id="product" className="section bg-[var(--grad-radial)]">
      <div className="container-wide">
        <StaggerContainer baseDelay={0} staggerDelay={100} direction="up">
          <ScrollReveal delay={0}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium mb-6">
                Product Preview
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                See Macro in <GradientText variant="cyan">Action</GradientText>
              </h2>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                Real interface previews showing how Macro generates workouts, plans nutrition, and converses naturally.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="glass rounded-2xl p-1 mb-8">
              <div className="flex gap-1 bg-black/30 rounded-xl p-1">
                {(Object.keys(TAB_CONFIG) as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-white/10 text-white shadow-lg"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                    role="tab"
                    aria-selected={activeTab === tab}
                  >
                    <Icon icon={TAB_CONFIG[tab].icon} size={16} />
                    {TAB_CONFIG[tab].label}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="relative">
              {activeTab === "workout" && <WorkoutMockup />}
              {activeTab === "nutrition" && <NutritionMockup />}
              {activeTab === "chat" && <ChatMockup />}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { 
                  icon: Zap, 
                  color: "text-yellow-400", 
                  title: "Instant Generation", 
                  desc: "Workouts & meals in seconds, not hours" 
                },
                { 
                  icon: Target, 
                  color: "text-red-400", 
                  title: "Goal-Oriented", 
                  desc: "Every recommendation ties to your objectives" 
                },
                { 
                  icon: TrendingUp, 
                  color: "text-green-400", 
                  title: "Progressive", 
                  desc: "Automatic progression & periodization" 
                },
              ].map((item, i) => (
                <div key={i} className="glass rounded-2xl p-6 text-center hover:border-cyan-400/30 transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/5 ${item.color} mb-4`}>
                    <Icon icon={item.icon} size={28} />
                  </div>
                  <h4 className="font-medium text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-white/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </StaggerContainer>
      </div>
    </section>
  );
}

function WorkoutMockup() {
  return (
    <div className="glass rounded-xl overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/30">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-sm text-white/50 font-mono">macro-workout-planner.tsx</span>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-cyan-400 text-xs font-medium">Generating…</span>
          <ThinkingOrb state="composing" size={20} speed={1.2} />
        </div>
      </div>
      <div className="p-6 md:p-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="glass rounded-xl p-5 border border-white/10">
              <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                <Dumbbell size={18} className="text-cyan-400" />
                Parameters
              </h4>
              <div className="space-y-3">
                <ParamRow label="Goal" value="Hypertrophy" />
                <ParamRow label="Experience" value="Intermediate" />
                <ParamRow label="Frequency" value="4 days/week" />
                <ParamRow label="Equipment" value="Full Gym" />
                <ParamRow label="Focus" value="Upper Body" />
                <ParamRow label="Duration" value="60-75 min" />
              </div>
            </div>
            <div className="glass rounded-xl p-5 border border-white/10">
              <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                <Target size={18} className="text-red-400" />
                Target Muscles
              </h4>
              <div className="flex flex-wrap gap-2">
                {["Chest", "Shoulders", "Triceps", "Upper Back", "Lats"].map((m, i) => (
                  <span key={i} className="px-3 py-1.5 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-cyan-400 text-sm">{m}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Dumbbell size={18} className="text-cyan-400" />
                  Generated Routine — Push Day
                </h4>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <span className="flex items-center gap-1 text-green-400"><CheckCircle size={14} /> 8 exercises</span>
                  <span className="flex items-center gap-1 text-blue-400"><Zap size={14} /> ~72 min</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Barbell Bench Press", sets: "3×8-10", rpe: "RPE 8", rest: "2-3 min", primary: true },
                  { name: "Incline DB Press", sets: "3×10-12", rpe: "RPE 9", rest: "2 min", primary: false },
                  { name: "Standing Overhead Press", sets: "3×8-10", rpe: "RPE 8", rest: "2-3 min", primary: true },
                  { name: "DB Lateral Raises", sets: "3×12-15", rpe: "RPE 9", rest: "90 sec", primary: false },
                  { name: "Cable Flyes", sets: "3×12-15", rpe: "RPE 9", rest: "90 sec", primary: false },
                  { name: "Overhead Tricep Ext", sets: "3×10-12", rpe: "RPE 9", rest: "90 sec", primary: false },
                  { name: "Skull Crushers", sets: "2×12-15", rpe: "RPE 10", rest: "60 sec", primary: false },
                  { name: "Face Pulls", sets: "3×15-20", rpe: "RPE 8", rest: "60 sec", primary: false },
                ].map((ex, i) => (
                  <div key={i} className={`flex items-center gap-4 p-3 rounded-lg transition-all ${ex.primary ? "bg-cyan-400/5 border border-cyan-400/10" : "bg-white/5 hover:bg-white/10"}`}>
                    <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-400 font-medium text-sm">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{ex.name}</p>
                      <p className="text-xs text-white/40">{ex.sets} • {ex.rpe} • {ex.rest} rest</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors" aria-label="Swap exercise">
                        <ArrowRight size={14} />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors" aria-label="View exercise details">
                        <Icon icon={Dumbbell} size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <button className="btn-secondary">Regenerate</button>
              <button className="btn-primary">Save to Calendar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NutritionMockup() {
  return (
    <div className="glass rounded-xl overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/30">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-sm text-white/50 font-mono">macro-nutrition-planner.tsx</span>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium">Ready</span>
        </div>
      </div>
      <div className="p-6 md:p-8">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="glass rounded-xl p-5 border border-white/10">
              <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                <Utensils size={18} className="text-green-400" />
                Daily Targets
              </h4>
              <div className="space-y-4">
                <MacroRing label="Protein" value="185g" target="185g" color="red" current={185} max={185} />
                <MacroRing label="Carbs" value="280g" target="280g" color="blue" current={210} max={280} />
                <MacroRing label="Fats" value="75g" target="75g" color="yellow" current={68} max={75} />
                <MacroRing label="Calories" value="2,420" target="2,420" color="cyan" current={2120} max={2420} />
              </div>
            </div>
            <div className="glass rounded-xl p-5 border border-white/10">
              <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                <Target size={18} className="text-red-400" />
                Preferences
              </h4>
              <div className="space-y-2">
                <PrefTag>High Protein</PrefTag>
                <PrefTag>Mediterranean</PrefTag>
                <PrefTag>Meal Prep Friendly</PrefTag>
                <PrefTag>No Shellfish</PrefTag>
                <PrefTag>Budget Conscious</PrefTag>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="glass rounded-xl p-5 border border-white/10">
              <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                <Utensils size={18} className="text-green-400" />
                Today's Meal Plan
              </h4>
              <div className="space-y-3">
                {[
                  { meal: "Breakfast", time: "7:30 AM", calories: 580, protein: 42, items: ["Greek yogurt bowl", "Berries & granola", "Honey drizzle"] },
                  { meal: "Lunch", time: "12:30 PM", calories: 650, protein: 48, items: ["Grilled chicken", "Quinoa tabbouleh", "Roasted vegetables"] },
                  { meal: "Pre-Workout", time: "4:00 PM", calories: 320, protein: 25, items: ["Banana", "Whey protein", "Almond butter"] },
                  { meal: "Dinner", time: "7:30 PM", calories: 620, protein: 50, items: ["Salmon fillet", "Sweet potato", "Asparagus"] },
                  { meal: "Late Snack", time: "9:30 PM", calories: 250, protein: 20, items: ["Cottage cheese", "Pineapple chunks"] },
                ].map((meal, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <span className="text-green-400 font-medium text-sm">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-medium text-white">{meal.meal}</h5>
                        <span className="text-sm text-white/40">{meal.time}</span>
                      </div>
                      <p className="text-white/60 text-sm mb-2">{meal.items.join(", ")}</p>
                      <div className="flex items-center gap-4 text-xs text-white/40">
                        <span className="flex items-center gap-1"><Icon icon={Flame} size={12} /> {meal.calories} cal</span>
                        <span className="flex items-center gap-1 text-red-400"><Icon icon={Dumbbell} size={12} /> {meal.protein}g protein</span>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors opacity-0 group-hover:opacity-100" aria-label="Swap meal">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <button className="btn-secondary">View Grocery List</button>
              <button className="btn-primary">Export Plan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMockup() {
  return (
    <div className="glass rounded-xl overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/30">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-sm text-white/50 font-mono">macro-ai-assistant.tsx</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Connected
          </span>
        </div>
      </div>
      <div className="h-[480px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <MessageBubble role="assistant" content="Hey! I'm Macro. What are we working on today — a new workout, meal plan, or just have a fitness question?" />
          <MessageBubble role="user" content="I want to build muscle but I only have 45 minutes, 3x/week. Can you design something efficient?" />
          <MessageBubble 
            role="assistant" 
            content=""
            isStreaming={true}
          />
        </div>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-end gap-3">
            <textarea className="flex-1 min-h-[56px] max-h-[120px] px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-400/50 focus:outline-none resize-none font-sans text-base" placeholder="Ask Macro anything…" />
            <button className="btn-primary h-12" aria-label="Send">
              <Icon icon={MessageCircle} size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParamRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/50 text-sm">{label}</span>
      <span className="font-medium text-white text-sm">{value}</span>
    </div>
  );
}

function MacroRing({ label, value, target, color, current, max }: { 
  label: string; 
  value: string; 
  target: string; 
  color: "red" | "blue" | "yellow" | "cyan";
  current: number;
  max: number;
}) {
  const percentage = Math.min(current / max, 1);
  const strokeDashoffset = 100 - percentage * 100;
  
  const colors = {
    red: "text-red-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
    cyan: "text-cyan-400",
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/60 text-sm">{label}</span>
        <span className="font-medium text-white text-sm">{value} / {target}</span>
      </div>
      <div className="relative w-20 h-20 mx-auto">
        <svg className="w-full h-full -rotate-90">
          <circle 
            cx="32" cy="32" r="28" 
            fill="none" stroke="white" strokeWidth="4" strokeOpacity="0.1"
          />
          <circle 
            cx="32" cy="32" r="28" 
            fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
            strokeDasharray="176" strokeDashoffset={strokeDashoffset}
            className={`${colors[color]} transition-all duration-1000`}
            style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-white text-xs">{Math.round(percentage * 100)}%</span>
        </div>
      </div>
    </div>
  );
}

function PrefTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/70 text-xs hover:border-cyan-400/30 hover:text-white transition-colors">
      {children}
    </span>
  );
}

function MessageBubble({ role, content, isStreaming }: { role: "user" | "assistant"; content: string | React.ReactNode; isStreaming?: boolean }) {
  return (
    <div className={`flex gap-3 ${role === "user" ? "flex-row-reverse" : ""}`}>
      <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center">
        {role === "assistant" ? (
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center">
            <MessageCircle size={16} className="text-cyan-400" />
          </div>
        ) : (
          <div className="w-full h-full rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white/30" />
          </div>
        )}
      </div>
      <div className={`max-w-[75%] ${role === "user" ? "text-right" : ""}`}>
        <div className={`inline-block px-5 py-3 rounded-2xl ${role === "user" ? "bg-gradient-to-br from-cyan-400 to-blue-600 text-black" : "bg-white/5 border border-white/10 text-white"}`}>
          {typeof content === "string" ? (
            <p className="whitespace-pre-wrap text-base leading-relaxed">{content}</p>
          ) : (
            content
          )}
          {isStreaming && (
            <div className="flex items-center gap-2 text-cyan-400/80 text-sm mt-2">
              <ThinkingOrb state="composing" size={20} speed={1.2} />
              <span>Thinking…</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}