"use client";

import { ScrollReveal } from "../ui/ScrollReveal";
import { GradientText } from "../ui/GradientText";
import { Dumbbell, Target, Zap, TrendingUp } from "lucide-react";
import { Icon } from "../ui/Icon";

export function WorkoutHero() {
  return (
    <section className="section relative overflow-hidden min-h-[70vh] flex items-center">
      <div className="absolute inset-0 bg-[var(--grad-radial)] pointer-events-none" aria-hidden="true" />
      <div className="container-wide relative">
        <ScrollReveal delay={0} direction="up">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium mb-6">
              <Icon icon={Dumbbell} size={14} />
              AI Workout Planner
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
              Train Smarter with <GradientText>Personalized Workouts</GradientText>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-10">
              Generate routines tailored to your goals, experience level, available equipment, and target muscle groups — all powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/waitlist" className="btn-primary">
                Get Early Access
              </a>
              <a href="#planner" className="btn-secondary">
                See How It Works
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={300} direction="up">
          <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Target, color: "text-red-400", title: "Goal-Oriented", desc: "Hypertrophy, strength, endurance, power" },
              { icon: Zap, color: "text-yellow-400", title: "Equipment-Aware", desc: "Full gym, dumbbells, bodyweight, bands" },
              { icon: TrendingUp, color: "text-green-400", title: "Progressive", desc: "Auto-progression with deload scheduling" },
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-6 hover:border-cyan-400/30 transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/5 ${item.color} mb-4`}>
                  <Icon icon={item.icon} size={28} />
                </div>
                <h4 className="font-medium text-white mb-2">{item.title}</h4>
                <p className="text-sm text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}