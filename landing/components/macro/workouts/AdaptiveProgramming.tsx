"use client";

import { ScrollReveal, StaggerContainer } from "../ui/ScrollReveal";
import { GradientText } from "../ui/GradientText";
import { Icon } from "../ui/Icon";
import { TrendingUp, BarChart3, RotateCcw, Zap, Target, AlertTriangle, CheckCircle, ChevronRight } from "lucide-react";

const ADAPTATION_TIMELINE = [
  { week: "Week 1", event: "Baseline established", details: "Initial volume and intensity set based on experience level", type: "baseline" },
  { week: "Week 2", event: "Technique refinement", details: "Form feedback integrated; accessory volume adjusted", type: "adjustment" },
  { week: "Week 3", event: "Volume increase +15%", details: "Progressive overload applied to main lifts", type: "progression" },
  { week: "Week 4", event: "Deload scheduled", details: "Volume reduced 40%, intensity maintained for recovery", type: "deload" },
  { week: "Week 5", event: "Exercise rotation", details: "DB Press → Barbell Press; Lateral Raise → Cable Fly", type: "rotation" },
  { week: "Week 6", event: "Intensity progression", details: "RPE targets increased; rest periods shortened", type: "progression" },
  { week: "Week 7", event: "Frequency adjustment", details: "3×/week → 4×/week upper/lower split", type: "adjustment" },
  { week: "Week 8", event: "Mesocycle complete", details: "Strength test week; new 1RM estimates calculated", type: "milestone" },
];

const ADAPTATION_TYPES = {
  baseline: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: BarChart3 },
  adjustment: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", icon: RotateCcw },
  progression: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", icon: TrendingUp },
  deload: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: AlertTriangle },
  rotation: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", icon: ChevronRight },
  milestone: { color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20", icon: Target },
};

export function AdaptiveProgramming() {
  return (
    <section id="adaptive-programming" className="section">
      <div className="container-wide">
        <StaggerContainer baseDelay={0} staggerDelay={100} direction="up">
          <ScrollReveal delay={0}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium mb-6">
                <Icon icon={TrendingUp} size={14} />
                Adaptive Programming
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                Workouts That <GradientText>Evolve With You</GradientText>
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                Macro automatically adjusts volume, intensity, exercise selection, and frequency based on your progress, feedback, and recovery signals.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="glass rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                      <Icon icon={TrendingUp} size={24} className="text-cyan-400" />
                    </div>
                    How Adaptation Works
                  </h3>
                  <div className="space-y-4">
                    {[
                      { title: "Progressive Overload", desc: "Automatic weight/rep progression when you hit target RPE consistently" },
                      { title: "Volume Auto-Regulation", desc: "Weekly volume adjusts based on recovery markers and performance trends" },
                      { title: "Smart Deloads", desc: "Preventive deloads scheduled before fatigue accumulates" },
                      { title: "Exercise Rotation", desc: "Movement patterns rotated to prevent overuse and stimulate new growth" },
                      { title: "Frequency Optimization", desc: "Training frequency adapts to your schedule and recovery capacity" },
                      { title: "Periodization Cycles", desc: "Mesocycles auto-structured: accumulation → intensification → realization" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 glass rounded-xl border border-white/10 hover:border-cyan-400/20 transition-all">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                          <Icon icon={CheckCircle} size={18} className="text-cyan-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-1">{item.title}</h4>
                          <p className="text-white/60 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <Icon icon={BarChart3} size={24} className="text-green-400" />
                    </div>
                    Real-Time Feedback Loop
                  </h3>
                  <div className="space-y-4">
                    <FeedbackStep number="01" title="Set Completion" desc="Log sets with actual reps, RPE, and optional notes" />
                    <FeedbackStep number="02" title="Session Rating" desc="Rate workout difficulty, energy, and joint comfort" />
                    <FeedbackStep number="03" title="Weekly Analysis" desc="Macro analyzes trends: volume tolerance, recovery speed, weak points" />
                    <FeedbackStep number="04" title="Auto-Adjustment" desc="Next week's plan generated with optimized parameters" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass rounded-2xl p-8 border border-white/10 h-full">
                  <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <Icon icon={Zap} size={24} className="text-purple-400" />
                    </div>
                    Adaptation Timeline Example
                  </h3>
                  <div className="space-y-4">
                    {ADAPTATION_TIMELINE.map((item, i) => {
                      const type = ADAPTATION_TYPES[item.type as keyof typeof ADAPTATION_TYPES];
                      const IconComponent = type.icon;
                      return (
                        <div key={i} className="relative flex items-start gap-4 group">
                          <div className="relative flex-shrink-0">
                            <div className={`w-10 h-10 rounded-xl ${type.bg} ${type.border} flex items-center justify-center`}>
                              <Icon icon={IconComponent} size={20} className={type.color} />
                            </div>
                            {i < ADAPTATION_TIMELINE.length - 1 && (
                              <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-white/10" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-medium text-white">{item.week}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${type.bg} ${type.border} ${type.color}`}>
                                {item.event}
                              </span>
                            </div>
                            <p className="text-white/60 text-sm ml-12">{item.details}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <Icon icon={AlertTriangle} size={24} className="text-red-400" />
                    </div>
                    Injury & Fatigue Management
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: "Joint Discomfort Detection", desc: "RPE spikes on specific movements trigger exercise substitutions" },
                      { title: "CNS Fatigue Monitoring", desc: "Consistent RPE underperformance triggers deload recommendation" },
                      { title: "Sleep & HRV Integration", desc: "Optional wearable data adjusts next session intensity" },
                      { title: "Return-to-Training Protocol", desc: "Gradual volume rebuild after injury or extended break" },
                    ].map((item, i) => (
                      <div key={i} className="p-4 glass rounded-xl border border-white/10 hover:border-cyan-400/20 transition-all">
                        <h4 className="font-medium text-white mb-1">{item.title}</h4>
                        <p className="text-white/60 text-sm">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </StaggerContainer>
      </div>
    </section>
  );
}

function FeedbackStep({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 p-4 glass rounded-xl border border-white/10">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
        <span className="font-medium text-cyan-400 text-sm">{number}</span>
      </div>
      <div>
        <h4 className="font-medium text-white mb-1">{title}</h4>
        <p className="text-white/60 text-sm">{desc}</p>
      </div>
    </div>
  );
}