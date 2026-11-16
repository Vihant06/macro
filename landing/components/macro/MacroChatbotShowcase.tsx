"use client";

import { MacroChatbot } from "./MacroChatbot";
import { ScrollReveal, StaggerContainer } from "./ui/ScrollReveal";
import { GradientText } from "./ui/GradientText";

export function MacroChatbotShowcase() {
  return (
    <section id="chatbot" className="section bg-[var(--grad-radial)]">
      <div className="container-wide">
        <StaggerContainer baseDelay={100} staggerDelay={150} direction="up">
          <ScrollReveal delay={0}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
                Live Preview — Try Macro AI
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                Your AI Fitness Coach, <GradientText variant="cyan">Ready to Chat</GradientText>
              </h2>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                Experience how Macro understands your goals, asks clarifying questions, and delivers personalized workout & nutrition plans in seconds — not hours.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="max-w-4xl mx-auto">
              <MacroChatbot />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="mt-12 grid md:grid-cols-3 gap-4 max-w-4xl mx-auto text-center">
              {[
                { icon: "💪", label: "Workout Plans", desc: "Hypertrophy, strength, endurance" },
                { icon: "🥗", label: "Meal Planning", desc: "Macros, recipes, grocery lists" },
                { icon: "🤖", label: "AI Coaching", desc: "Form cues, progression, motivation" },
              ].map((item, i) => (
                <div key={i} className="glass rounded-2xl p-5 hover:border-cyan-400/30 transition-all duration-300">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h4 className="font-medium text-white mb-1">{item.label}</h4>
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