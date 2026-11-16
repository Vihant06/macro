"use client";

import { Target, Flame, Dumbbell, PieChart, TrendingUp, CheckCircle, AlertCircle, BarChart3, type LucideIcon } from "lucide-react";
import { ScrollReveal, StaggerContainer } from "../ui/ScrollReveal";
import { GradientText } from "../ui/GradientText";
import { Icon } from "../ui/Icon";

const DAILY_DATA = [
  { day: "Mon", calories: 2380, protein: 182, carbs: 275, fat: 72, targetCal: 2400, targetPro: 185, targetCarb: 280, targetFat: 75 },
  { day: "Tue", calories: 2420, protein: 188, carbs: 282, fat: 74, targetCal: 2400, targetPro: 185, targetCarb: 280, targetFat: 75 },
  { day: "Wed", calories: 2350, protein: 179, carbs: 268, fat: 70, targetCal: 2400, targetPro: 185, targetCarb: 280, targetFat: 75 },
  { day: "Thu", calories: 2450, protein: 191, carbs: 285, fat: 76, targetCal: 2400, targetPro: 185, targetCarb: 280, targetFat: 75 },
  { day: "Fri", calories: 2390, protein: 185, carbs: 278, fat: 73, targetCal: 2400, targetPro: 185, targetCarb: 280, targetFat: 75 },
  { day: "Sat", calories: 2520, protein: 195, carbs: 295, fat: 80, targetCal: 2400, targetPro: 185, targetCarb: 280, targetFat: 75 },
  { day: "Sun", calories: 2280, protein: 172, carbs: 255, fat: 68, targetCal: 2400, targetPro: 185, targetCarb: 280, targetFat: 75 },
];

const WEEKLY_AVG = DAILY_DATA.reduce((acc, d) => ({
  calories: acc.calories + d.calories,
  protein: acc.protein + d.protein,
  carbs: acc.carbs + d.carbs,
  fat: acc.fat + d.fat,
}), { calories: 0, protein: 0, carbs: 0, fat: 0 });

const WEEKLY_TARGET = {
  calories: 2400,
  protein: 185,
  carbs: 280,
  fat: 75,
};

export function MacroTracker() {
  return (
    <section id="macro-tracker" className="section bg-[var(--grad-radial)]">
      <div className="container-wide">
        <StaggerContainer baseDelay={0} staggerDelay={100} direction="up">
          <ScrollReveal delay={0}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6">
                <Icon icon={Target} size={14} />
                Macro Tracking & Analytics
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                Track Every <GradientText variant="cyan">Macro</GradientText>
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                Real-time macro tracking with weekly trends, adherence scores, and AI-powered adjustments to keep you on target.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Avg Calories", value: Math.round(WEEKLY_AVG.calories / 7), target: WEEKLY_TARGET.calories, unit: "cal", color: "cyan" as const, icon: Flame },
                { label: "Avg Protein", value: Math.round(WEEKLY_AVG.protein / 7), target: WEEKLY_TARGET.protein, unit: "g", color: "red" as const, icon: Dumbbell },
                { label: "Avg Carbs", value: Math.round(WEEKLY_AVG.carbs / 7), target: WEEKLY_TARGET.carbs, unit: "g", color: "blue" as const, icon: PieChart },
                { label: "Avg Fats", value: Math.round(WEEKLY_AVG.fat / 7), target: WEEKLY_TARGET.fat, unit: "g", color: "yellow" as const, icon: TrendingUp },
              ].map((stat, i) => (
                <MacroStatCard key={i} {...stat} />
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="glass rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                    <Icon icon={BarChart3} size={24} className="text-cyan-400" />
                  </div>
                  Weekly Calorie Trend
                </h3>
                <div className="h-80 flex items-end justify-between gap-3 px-2">
                  {DAILY_DATA.map((day, i) => {
                    const pct = Math.min(day.calories / day.targetCal, 1);
                    const isOver = day.calories > day.targetCal;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full relative h-full min-h-[200px]">
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10" />
                          <div className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${isOver ? "bg-red-500/60" : "bg-green-500/60"}`} style={{ height: `${Math.max(pct * 180, 20)}px` }} />
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400/30" style={{ bottom: `${(day.targetCal / 3000) * 180}px` }} />
                        </div>
                        <span className="text-white/50 text-xs">{day.day}</span>
                        <span className={`text-xs font-medium ${isOver ? "text-red-400" : "text-green-400"}`}>
                          {day.calories > day.targetCal ? "+" : ""}{day.calories - day.targetCal}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/50">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500/60" /> Under Target</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500/60" /> Over Target</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cyan-400/30" /> Daily Target</div>
                </div>
              </div>

              <div className="glass rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <Icon icon={Target} size={24} className="text-green-400" />
                  </div>
                  Weekly Adherence Score
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <AdherenceRing label="Calories" value={Math.round((1 - Math.abs(WEEKLY_AVG.calories/7 - WEEKLY_TARGET.calories) / WEEKLY_TARGET.calories) * 100)} color="cyan" />
                  <AdherenceRing label="Protein" value={Math.round((1 - Math.abs(WEEKLY_AVG.protein/7 - WEEKLY_TARGET.protein) / WEEKLY_TARGET.protein) * 100)} color="red" />
                  <AdherenceRing label="Carbs" value={Math.round((1 - Math.abs(WEEKLY_AVG.carbs/7 - WEEKLY_TARGET.carbs) / WEEKLY_TARGET.carbs) * 100)} color="blue" />
                  <AdherenceRing label="Fats" value={Math.round((1 - Math.abs(WEEKLY_AVG.fat/7 - WEEKLY_TARGET.fat) / WEEKLY_TARGET.fat) * 100)} color="yellow" />
                </div>
                <div className="mt-8 space-y-3">
                  {[
                    { metric: "Calorie Consistency", score: 92, trend: "+3% vs last week" },
                    { metric: "Protein Hit Rate", score: 88, trend: "+1% vs last week" },
                    { metric: "Carb Timing", score: 85, trend: "—" },
                    { metric: "Fat Distribution", score: 90, trend: "+2% vs last week" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 glass rounded-xl border border-white/10">
                      <span className="text-white/70">{item.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${item.score >= 90 ? "text-green-400" : item.score >= 85 ? "text-yellow-400" : "text-red-400"}`}>{item.score}%</span>
                        <span className="text-white/50 text-xs">{item.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="glass rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Icon icon={TrendingUp} size={24} className="text-purple-400" />
                </div>
                AI-Powered Insights & Auto-Adjustments
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: CheckCircle, color: "text-green-400", title: "Protein Target Hit", desc: "You've hit 185g+ protein 5/7 days this week. Consistency improving.", type: "positive" },
                  { icon: AlertCircle, color: "text-yellow-400", title: "Weekend Calorie Drift", desc: "Sat/Sun calories avg +120 vs weekdays. Consider prep strategy.", type: "warning" },
                  { icon: TrendingUp, color: "text-blue-400", title: "Carb Timing Optimized", desc: "Pre/post-workout carbs aligned with training days. Good adherence.", type: "positive" },
                  { icon: Target, color: "text-cyan-400", title: "Suggested Adjustment", desc: "Reduce Sunday calories by 150, shift to Mon-Thu for better weekly avg.", type: "suggestion" },
                  { icon: Dumbbell, color: "text-purple-400", title: "Training-Nutrition Sync", desc: "Next week's meal plan will increase carbs on leg days (Tue/Fri).", type: "info" },
                  { icon: PieChart, color: "text-orange-400", title: "Micronutrient Gap", desc: "Magnesium & Vitamin D below RDA. Consider supplementation.", type: "warning" },
                ].map((item, i) => (
                  <InsightCard key={i} {...item} />
                ))}
              </div>
            </div>
          </ScrollReveal>
        </StaggerContainer>
      </div>
    </section>
  );
}

function MacroStatCard({ label, value, target, unit, color, icon }: { label: string; value: number; target: number; unit: string; color: "cyan" | "red" | "blue" | "yellow"; icon: LucideIcon } ) {
  const pct = Math.min(value / target, 1);
  const isOver = value > target;
  
  const iconMap: Record<string, LucideIcon> = {
    cyan: TrendingUp,
    red: Dumbbell,
    blue: PieChart,
    yellow: Flame,
  };
  
  const IconComponent = iconMap[color] ?? TrendingUp;
  
  const colors = {
    cyan: "text-cyan-400",
    red: "text-red-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 hover:border-cyan-400/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Icon icon={IconComponent} size={20} className={colors[color]} />
        </div>
        <span className={`font-medium ${isOver ? "text-red-400" : "text-green-400"}`}>
          {value > target ? "+" : ""}{value - target}{unit}
        </span>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-white/50">{label}</span>
          <span className="font-medium text-white">{value.toLocaleString()}{unit}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full ${colors[color]} rounded-full transition-all duration-1000`} style={{ width: `${pct * 100}%` }} />
        </div>
      </div>
      <div className="text-xs text-white/50">Target: {target.toLocaleString()}{unit}</div>
    </div>
  );
}

function AdherenceRing({ label, value, color }: { label: string; value: number; color: "cyan" | "red" | "blue" | "yellow" }) {
  const strokeDashoffset = 100 - value;
  
  const colors = {
    cyan: "text-cyan-400",
    red: "text-red-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full -rotate-90">
          <circle cx="48" cy="48" r="42" fill="none" stroke="white" strokeWidth="6" strokeOpacity="0.1" />
          <circle
            cx="48" cy="48" r="42"
            fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"
            strokeDasharray="264" strokeDashoffset={strokeDashoffset}
            className={`${colors[color]} transition-all duration-1000`}
            style={{ filter: "drop-shadow(0 0 12px currentColor)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="font-bold text-white text-2xl">{value}%</span>
          <span className="text-white/50 text-xs">Adherence</span>
        </div>
      </div>
      <span className="font-medium text-white">{label}</span>
    </div>
  );
}

function InsightCard({ icon: IconComponent, color, title, desc, type }: { icon: LucideIcon; color: string; title: string; desc: string; type: string }) {
  const typeStyles = {
    positive: "border-green-500/30 bg-green-500/5",
    warning: "border-yellow-500/30 bg-yellow-500/5",
    suggestion: "border-cyan-500/30 bg-cyan-500/5",
    info: "border-purple-500/30 bg-purple-500/5",
  };

  return (
    <div className={`p-5 glass rounded-xl border ${typeStyles[type as keyof typeof typeStyles] || "border-white/10"}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Icon icon={IconComponent} size={20} className={color} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-white mb-1">{title}</h4>
          <p className="text-white/60 text-sm">{desc}</p>
        </div>
      </div>
    </div>
  );
}