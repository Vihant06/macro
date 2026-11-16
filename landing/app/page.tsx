"use client";

import Hero49MacroRefined from "@/components/originkit/hero-49-macro-refined";
import Link from "next/link";
import { GradientText } from "@/components/macro/ui/GradientText";
import { Icon } from "@/components/macro/ui/Icon";
import { Dumbbell, Utensils, Target, Brain, Shield, Code, ArrowRight, Zap, Sparkles, FlaskConical, Leaf, Flame } from "lucide-react";
import { ScrollReveal, StaggerContainer } from "@/components/macro/ui/ScrollReveal";

export default function HomePage() {
  return (
    <>
      <Hero49MacroRefined />

      {/* Section 1 — Introducing Macro */}
      <section id="introducing" className="section">
        <div className="container">
          <ScrollReveal delay={0} direction="up">
            <div className="text-center max-w-[850px] mx-auto mb-16">
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium">
                  Introducing Macro
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                One <GradientText>Intelligent Companion.</GradientText> Your Entire Fitness Journey.
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">
                Macro brings workout planning, exercise discovery, and personalized nutrition into one AI-powered platform. Instead of juggling separate apps for training, meals, and progress tracking, Macro unifies everything behind a single conversational interface that adapts to your goals, preferences, and progress.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200} direction="up">
            <div className="grid md:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
              <article className="glass rounded-2xl p-6 md:p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-500 group flex flex-col h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon={Dumbbell} size={28} className="text-cyan-400" />
                </div>
                <h3 className="text-lg md:text-xl font-medium text-white mb-3 tracking-tight">Workout Planning</h3>
                <p className="text-base text-white/60 leading-relaxed">
                  AI-generated routines tailored to your experience, equipment, and goals.
                </p>
              </article>
              <article className="glass rounded-2xl p-6 md:p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-500 group flex flex-col h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon={Target} size={28} className="text-cyan-400" />
                </div>
                <h3 className="text-lg md:text-xl font-medium text-white mb-3 tracking-tight">Exercise Discovery</h3>
                <p className="text-base text-white/60 leading-relaxed">
                  Find movements by muscle group, body part, or available equipment with detailed form guidance.
                </p>
              </article>
              <article className="glass rounded-2xl p-6 md:p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-500 group flex flex-col h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon={Utensils} size={28} className="text-cyan-400" />
                </div>
                <h3 className="text-lg md:text-xl font-medium text-white mb-3 tracking-tight">Personalized Nutrition</h3>
                <p className="text-base text-white/60 leading-relaxed">
                  Meal plans that adapt to your dietary preferences, protein targets, and calorie goals.
                </p>
              </article>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 2 — Workout Intelligence */}
      <section id="workout-intelligence" className="section bg-[var(--grad-radial)]">
        <div className="container">
          <ScrollReveal delay={0} direction="up">
            <div className="text-center max-w-[850px] mx-auto mb-16">
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium">
                  Workout Intelligence
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                Your Training. <GradientText>Smarter Than Ever.</GradientText>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">
                AI that plans, adapts, and evolves with every rep you complete.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200} direction="up">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
              {[
                {
                  icon: Dumbbell,
                  color: "cyan",
                  title: "AI-Powered Planning",
                  desc: "Workout routines generated from your goals, experience, and equipment.",
                },
                {
                  icon: Target,
                  color: "blue",
                  title: "Exercise Discovery",
                  desc: "Find movements by muscle group, body part, or available equipment.",
                },
                {
                  icon: Flame,
                  color: "red",
                  title: "Muscle-Specific Training",
                  desc: "Targeted programming for chest, back, legs, arms, shoulders, and core.",
                },
                {
                  icon: Zap,
                  color: "purple",
                  title: "Adaptive Programming",
                  desc: "Plans that evolve automatically as your strength and endurance improve.",
                },
              ].map((item, i) => (
                <article
                  key={i}
                  className="glass rounded-2xl p-6 md:p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-500 group flex flex-col h-full"
                >
                  <div className={`w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:bg-cyan-400/10 transition-colors`}>
                    <Icon icon={item.icon} size={24} className={`text-${item.color}-400`} />
                  </div>
                  <h3 className="text-lg md:text-xl font-medium text-white mb-3 tracking-tight group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-base text-white/60 leading-relaxed">{item.desc}</p>
                </article>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 3 — Intelligent Nutrition */}
      <section id="intelligent-nutrition" className="section">
        <div className="container">
          <ScrollReveal delay={0} direction="up">
            <div className="text-center max-w-[850px] mx-auto mb-16">
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium">
                  Intelligent Nutrition
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                Nutrition That <GradientText>Works With Your Goals.</GradientText>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">
                Meal planning that understands your protein targets, dietary preferences, and calorie needs — without the guesswork.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200} direction="up">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
              {[
                {
                  icon: Leaf,
                  color: "green",
                  title: "Personalized Meal Planning",
                  desc: "Weekly meal plans built around your dietary preferences and schedule.",
                },
                {
                  icon: Flame,
                  color: "red",
                  title: "High-Protein Recommendations",
                  desc: "Protein-first meal suggestions to support muscle recovery and growth.",
                },
                {
                  icon: Zap,
                  color: "blue",
                  title: "Calorie & Macro Awareness",
                  desc: "Clear visibility into calories, protein, carbs, and fats for every meal.",
                },
                {
                  icon: Brain,
                  color: "purple",
                  title: "Dietary Preference Matching",
                  desc: "Recommendations that respect your restrictions, allergies, and food preferences.",
                },
              ].map((item, i) => (
                <article
                  key={i}
                  className="glass rounded-2xl p-6 md:p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-500 group flex flex-col h-full"
                >
                  <div className={`w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:bg-cyan-400/10 transition-colors`}>
                    <Icon icon={item.icon} size={24} className={`text-${item.color}-400`} />
                  </div>
                  <h3 className="text-lg md:text-xl font-medium text-white mb-3 tracking-tight group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-base text-white/60 leading-relaxed">{item.desc}</p>
                </article>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 4 — Built Different */}
      <section id="built-different" className="section bg-[var(--grad-radial)]">
        <div className="container">
          <ScrollReveal delay={0} direction="up">
            <div className="text-center max-w-[850px] mx-auto mb-16">
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium">
                  Built Different
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                Built <GradientText>Different.</GradientText> On Purpose.
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">
                Every architectural decision in Macro exists to remove friction between you and your goals.
              </p>
            </div>
          </ScrollReveal>

<ScrollReveal delay={200} direction="up">
            <div className="flex flex-wrap justify-center gap-6 max-w-[1200px] mx-auto">
              {[
                {
                  icon: Shield,
                  color: "cyan",
                  title: "Unified Platform",
                  desc: "Workout planning and nutrition management in one intelligent conversation.",
                },
                {
                  icon: Code,
                  color: "blue",
                  title: "Intelligent Tool Calling",
                  desc: "AI agents interact with external APIs for real-time exercise and nutrition data.",
                },
                {
                  icon: Brain,
                  color: "purple",
                  title: "Personalized Recommendations",
                  desc: "Every response adapts to your goals, experience, and requirements.",
                },
                {
                  icon: Zap,
                  color: "green",
                  title: "LangChain Agent Orchestration",
                  desc: "Multi-agent workflows that reason, plan, and execute on your behalf.",
                },
                {
                  icon: FlaskConical,
                  color: "pink",
                  title: "NVIDIA Nemotron-Powered",
                  desc: "State-of-the-art language models driving intelligent fitness guidance.",
                },
              ].map((item, i) => (
                <article
                  key={i}
                  className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] glass rounded-2xl p-6 md:p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-500 group flex flex-col h-full"
                >
                  <div className={`w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:bg-cyan-400/10 transition-colors`}>
                    <Icon icon={item.icon} size={24} className={`text-${item.color}-400`} />
                  </div>
                  <h3 className="text-lg md:text-xl font-medium text-white mb-3 tracking-tight group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-base text-white/60 leading-relaxed">{item.desc}</p>
                </article>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 5 — Technology */}
      <section id="technology" className="section">
        <div className="container">
          <ScrollReveal delay={0} direction="up">
            <div className="text-center max-w-[850px] mx-auto mb-16">
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium">
                  Technology
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                Intelligence <GradientText>Behind Every Recommendation.</GradientText>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">
                Macro combines proven AI frameworks with fitness data to deliver guidance you can trust.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200} direction="up">
            <div className="grid md:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
              {[
                {
                  number: "01",
                  name: "LangChain",
                  desc: "Orchestrates AI agents that plan workouts, suggest meals, and answer fitness questions in context.",
                },
                {
                  number: "02",
                  name: "NVIDIA Nemotron",
                  desc: "Powers the language models behind Macro's conversational intelligence and recommendations.",
                },
                {
                  number: "03",
                  name: "Exercise APIs",
                  desc: "Connects to exercise databases for accurate movement data, form cues, and muscle targeting.",
                },
                {
                  number: "04",
                  name: "External Integrations",
                  desc: "Pulls in nutrition data, food databases, and wearable metrics for a complete health picture.",
                },
                {
                  number: "05",
                  name: "AI Agent Workflows",
                  desc: "Reasoning chains that break down complex fitness goals into actionable daily steps.",
                },
              ].map((item, i) => (
                <article key={i} className="glass rounded-2xl p-6 md:p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-500 group flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6 group-hover:gap-4 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                      <span className="text-cyan-400 font-medium text-sm">{item.number}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-medium text-white group-hover:text-cyan-400 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-base text-white/60 leading-relaxed">{item.desc}</p>
                </article>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 6 — Early Access */}
      <section id="cta" className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--grad-radial-strong)] pointer-events-none" aria-hidden="true" />
        <div className="container relative z-10 text-center">
          <ScrollReveal delay={0} direction="up">
            <div className="glass rounded-2xl p-8 md:p-12 border border-cyan-400/20 max-w-[850px] mx-auto">
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium">
                  <Icon icon={Sparkles} size={14} />
                  Early Access
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                Ready to <GradientText>Train Smarter?</GradientText>
              </h2>
              <p className="text-lg text-white/60 mb-8 max-w-[700px] mx-auto leading-relaxed">
                Join the early-access community and experience a smarter approach to fitness and nutrition.
              </p>
              <Link href="/waitlist" className="btn-primary inline-flex items-center gap-2">
                Join the Waitlist
                <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
