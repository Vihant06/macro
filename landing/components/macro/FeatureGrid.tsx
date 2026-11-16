"use client";

import { 
  Dumbbell, 
  Search, 
  GitBranch, 
  Utensils, 
  Flame, 
  MessageSquare 
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { StaggerContainer } from "./ui/ScrollReveal";
import { ScrollReveal } from "./ui/ScrollReveal";
import { GradientText } from "./ui/GradientText";

const FEATURES = [
  {
    icon: Dumbbell,
    title: "AI Workout Planner",
    description: "Generate personalized workout routines based on your goals, experience level, available equipment, and target muscle groups. Progressive overload built-in.",
    accent: "cyan" as const,
  },
  {
    icon: Search,
    title: "Smart Exercise Discovery",
    description: "Find exercises by name, muscle group, body part, or equipment. Detailed descriptions, form cues, video references, and alternative movements included.",
    accent: "blue" as const,
  },
  {
    icon: GitBranch,
    title: "Adaptive Programming",
    description: "Workouts that evolve with your progress. Automatic deloads, volume adjustments, and periodization based on your feedback and performance data.",
    accent: "purple" as const,
  },
  {
    icon: Utensils,
    title: "AI Nutrition Planner",
    description: "Create personalized meal plans based on dietary preferences, calorie requirements, and macronutrient goals. Grocery lists and prep schedules included.",
    accent: "green" as const,
  },
  {
    icon: Flame,
    title: "High-Protein Meal Recommendations",
    description: "Discover meals and food combinations that help you hit daily protein targets effortlessly. Filter by cuisine, prep time, and dietary restrictions.",
    accent: "orange" as const,
  },
  {
    icon: MessageSquare,
    title: "Conversational Adjustments",
    description: "Modify workouts, swap exercises, adjust macros, or ask questions naturally. Macro remembers context and adapts recommendations in real-time.",
    accent: "pink" as const,
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="section">
      <div className="container-wide">
        <StaggerContainer baseDelay={0} staggerDelay={100} direction="up">
          <ScrollReveal delay={0}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium mb-6">
                Core Capabilities
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                Everything You Need to <GradientText>Train Smarter</GradientText>
              </h2>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                Six specialized AI capabilities unified in one conversational platform. No more switching between apps, trackers, and databases.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  accent={feature.accent}
                  delay={index * 100}
                  index={index}
                />
              ))}
            </div>
          </ScrollReveal>
        </StaggerContainer>
      </div>
    </section>
  );
}