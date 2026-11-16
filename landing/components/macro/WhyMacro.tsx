"use client";

import { 
  Layers, 
  Zap, 
  User, 
  Brain, 
  Shield, 
  Code,
  ArrowRight,
  Check
} from "lucide-react";
import { ScrollReveal, StaggerContainer } from "./ui/ScrollReveal";
import { GradientText } from "./ui/GradientText";
import { Icon } from "./ui/Icon";
import { GlowBorder } from "./ui/GlowBorder";

const WHY_ITEMS = [
  {
    icon: Layers,
    title: "Unified Platform",
    description: "One conversation replaces your workout logger, nutrition tracker, exercise database, meal planner, and progress journal. No more context switching.",
    visual: (
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
        </div>
        {[
          { label: "Workouts", pos: "top-4 left-4", color: "cyan" },
          { label: "Nutrition", pos: "top-4 right-4", color: "green" },
          { label: "Exercises", pos: "bottom-4 left-4", color: "orange" },
          { label: "Progress", pos: "bottom-4 right-4", color: "purple" },
        ].map((item, i) => (
          <div key={i} className={`absolute ${item.pos} flex items-center gap-2 px-3 py-2 glass rounded-xl border border-white/10 animate-float`}>
            <div className={`w-2 h-2 rounded-full bg-${item.color}-400`} />
            <span className="text-sm text-white/80">{item.label}</span>
          </div>
        ))}
        <div className="absolute inset-0" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <svg key={i} className="absolute inset-0 stroke-cyan-400/20" viewBox="0 0 400 400">
              <line x1="200" y1="200" x2={i % 2 === 0 ? 50 : 350} y2={i < 2 ? 50 : 350} strokeWidth="1" strokeDasharray="4,4" />
            </svg>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Zap,
    title: "Intelligent Tool Calling",
    description: "Real-time API integrations fetch current exercise data, nutrition info, and scientific research — not static knowledge cutoffs. Every recommendation is grounded.",
    visual: (
      <div className="relative h-64 font-mono text-sm">
        <div className="glass rounded-xl p-5 border border-white/10 overflow-hidden font-mono text-sm">
          <div className="flex items-center gap-2 text-white/40 mb-4">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <pre className="text-white/70 leading-relaxed">
{`// User asks: "Best chest exercise for hypertrophy?"
const response = await macro.agent.run({
  tools: [
    exerciseDB.search({ muscle: "chest", goal: "hypertrophy" }),
    pubmed.query("chest hypertrophy exercise selection"),
    userProfile.getPreferences()
  ],
  model: "nemotron-3-ultra"
});

// Tool calls execute in parallel
▶ exerciseDB.search() → 47 exercises found
▶ pubmed.query() → 12 relevant studies  
▶ userProfile.get() → preferences loaded

// Synthesis with citations
return synthesize(response, { citations: true });`}
          </pre>
        </div>
      </div>
    ),
  },
  {
    icon: User,
    title: "Personalized to You",
    description: "Recommendations adapt to your fitness objectives, preferences, schedule, injury history, and progress over time. The more you use it, the smarter it gets.",
    visual: (
      <div className="relative h-64">
        <div className="glass rounded-xl p-5 border border-white/10 h-full">
          <div className="grid grid-cols-2 gap-4">
            <div className="lg:col-span-1 space-y-4">
              <div className="glass rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-white">Alex Chen</span>
                  <span className="text-xs text-green-400">Active 14 days</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/60">Goal</span><span className="text-cyan-400">Hypertrophy</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Level</span><span className="text-blue-400">Intermediate</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Schedule</span><span className="text-purple-400">4×/week</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Equipment</span><span className="text-orange-400">Full Gym</span></div>
                </div>
              </div>
              <div className="glass rounded-lg p-4 border border-white/10">
                <h5 className="font-medium text-white mb-3">Adaptation History</h5>
                <div className="space-y-2 text-xs">
                  <AdaptationRow week="Week 1" change="Baseline established" />
                  <AdaptationRow week="Week 3" change="Volume +15%" color="green" />
                  <AdaptationRow week="Week 5" change="Deload scheduled" color="yellow" />
                  <AdaptationRow week="Week 7" change="Exercise swap: DB → BB" color="blue" />
                  <AdaptationRow week="Week 9" change="Frequency 4→5 days" color="purple" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="glass rounded-lg p-4 border border-white/10 h-full relative">
                <canvas className="w-full h-48" aria-label="Progress chart showing volume adaptation over 9 weeks" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Brain,
    title: "Powered by Nemotron + LangChain",
    description: "NVIDIA's state-of-the-art Nemotron 3 Ultra LLM combined with LangChain agent orchestration. Enterprise-grade reliability, contextual awareness, and tool-use precision.",
    visual: (
      <div className="relative h-64 flex items-center justify-center">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="w-28 h-28 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <span className="text-4xl">🧠</span>
            </div>
            <h5 className="font-medium text-white">Nemotron 3 Ultra</h5>
            <p className="text-sm text-white/50">53B params • 8K context</p>
          </div>
          <div className="w-1 h-24 bg-gradient-to-b from-cyan-400 to-purple-500 opacity-50" />
          <div className="text-center">
            <div className="w-28 h-28 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Code size={32} className="text-white" />
            </div>
            <h5 className="font-medium text-white">LangChain</h5>
            <p className="text-sm text-white/50">Agent orchestration • Tools • Memory</p>
          </div>
          <div className="w-1 h-24 bg-gradient-to-b from-cyan-400 to-purple-500 opacity-50" />
          <div className="text-center">
            <div className="w-28 h-28 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
              <Shield size={32} className="text-white" />
            </div>
            <h5 className="font-medium text-white">Reliability Layer</h5>
            <p className="text-sm text-white/50">Guardrails • Eval • Observability</p>
          </div>
        </div>
      </div>
    ),
  },
];

function AdaptationRow({ week, change, color = "white" }: { week: string; change: string; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/50">{week}</span>
      <span className={`text-${color}-400 font-medium`}>{change}</span>
    </div>
  );
}

export function WhyMacro() {
  return (
    <section id="why-macro" className="section">
      <div className="container-wide">
        <StaggerContainer baseDelay={0} staggerDelay={100} direction="up">
          <ScrollReveal delay={0}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium mb-6">
                Why Macro?
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                Built Different.<GradientText variant="cyan"> On Purpose.</GradientText>
              </h2>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                Four architectural decisions that make Macro fundamentally different from every other fitness app.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="space-y-12">
              {WHY_ITEMS.map((item, index) => (
                <GlowBorder key={item.title} intensity="medium" className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-start ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                  <div className={`lg:w-1/2 flex-1 ${index % 2 === 1 ? "lg:pr-8" : "lg:pl-8"} flex flex-col justify-center`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                        <Icon icon={item.icon} size={24} className="text-cyan-400" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-light font-serif text-white">{item.title}</h3>
                    </div>
                    <p className="text-lg text-white/60 leading-relaxed mb-6 max-w-lg">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-cyan-400 font-medium text-sm group-hover:gap-3 transition-all duration-300">
                      Learn more
                      <ArrowRight size={16} />
                    </div>
                  </div>
                  <div className="lg:w-1/2 flex-1 min-h-[300px]">
                    {item.visual}
                  </div>
                </GlowBorder>
              ))}
            </div>
          </ScrollReveal>
        </StaggerContainer>
      </div>
    </section>
  );
}