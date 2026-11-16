import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GradientText } from "@/components/macro/ui/GradientText";
import { Icon } from "@/components/macro/ui/Icon";
import { ScrollReveal } from "@/components/macro/ui/ScrollReveal";
import { SectionHeading } from "@/components/macro/about/SectionHeading";
import { FeatureCard } from "@/components/macro/about/FeatureCard";
import { FeaturePanel, MetricCard, PanelItem } from "@/components/macro/about/FeaturePanel";
import "./about.css";

export const metadata: Metadata = {
  title: "About Macro — AI-Powered Fitness & Nutrition Platform",
  description:
    "Discover Macro: one intelligent platform combining AI workout planning, exercise discovery, personalized nutrition, and adaptive programming — all powered by NVIDIA Nemotron and LangChain.",
};

const OVERVIEW_CARDS = [
  {
    icon: "Dumbbell",
    title: "AI Workout Planning",
    description:
      "Generate personalized routines tailored to your goals, experience, equipment, and schedule. Progressive overload, deloads, and periodization built in.",
  },
  {
    icon: "Search",
    title: "Exercise Discovery",
    description:
      "Search 500+ exercises by muscle group, equipment, or movement pattern. Detailed form cues, video references, and alternative movements included.",
  },
  {
    icon: "Utensils",
    title: "Personalized Nutrition",
    description:
      "Meal plans that adapt to your dietary preferences, calorie targets, and macro goals. Grocery lists, prep schedules, and high-protein recipes included.",
  },
];

const WORKOUT_CARDS = [
  {
    icon: "Dumbbell",
    title: "AI Workout Planner",
    description:
      "Configure your goals, experience, equipment, and schedule. Macro generates complete routines with sets, reps, RPE targets, rest periods, and progressive overload built in.",
    chips: ["Goal-Based Generation", "Equipment-Aware", "Progressive Overload", "Auto Deloads"],
  },
  {
    icon: "Search",
    title: "Smart Exercise Discovery",
    description:
      "Search 500+ exercises by muscle group, equipment, movement pattern, or name. Detailed form cues, video references, and alternative movements included.",
    chips: ["500+ Exercises", "Form Cues", "Video Refs", "Alternatives"],
  },
];

const ADAPTIVE_FEATURES = [
  { title: "Progressive Overload", description: "Auto weight/rep progression when you hit target RPE" },
  { title: "Volume Auto-Regulation", description: "Weekly volume adjusts based on recovery and performance" },
  { title: "Smart Deloads", description: "Preventive deloads scheduled before fatigue accumulates" },
  { title: "Exercise Rotation", description: "Movement patterns rotated to prevent overuse and stimulate growth" },
  { title: "Frequency Optimization", description: "Training frequency adapts to your schedule and recovery" },
  { title: "Periodization Cycles", description: "Mesocycles auto-structured: accumulation → intensification → realization" },
];

const NUTRITION_CARDS = [
  {
    icon: "Utensils",
    title: "AI Nutrition Planner",
    description:
      "Set your targets, preferences, and constraints. Macro generates complete meal plans with recipes, macros per meal, grocery lists, and prep schedules.",
    chips: ["Personalized Meal Plans", "Grocery Lists", "Prep Schedules", "Diet-Aware"],
  },
  {
    icon: "Flame",
    title: "High-Protein Meal Discovery",
    description:
      "Discover 500+ high-protein meals filtered by diet, meal type, and protein content. Each recipe includes macros, prep time, and grocery list integration.",
    chips: ["500+ Recipes", "Macro Breakdown", "Grocery Integration", "Meal Prep Guides"],
  },
];

const MACRO_METRICS = [
  {
    label: "Calories",
    icon: "Flame",
    tone: "cyan" as const,
    description: "Daily intake tracked against your target with weekly trend lines.",
  },
  {
    label: "Protein",
    icon: "Dumbbell",
    tone: "red" as const,
    description: "Gram targets broken down per meal with adherence scoring.",
  },
  {
    label: "Carbs",
    icon: "Leaf",
    tone: "blue" as const,
    description: "Totals and timing matched to training-day demands.",
  },
  {
    label: "Fats",
    icon: "Zap",
    tone: "yellow" as const,
    description: "Calorie density tracked alongside your overall macro balance.",
  },
];

const TECHNOLOGY_CARDS = [
  {
    title: "Unified AI Platform",
    icon: "Layers",
    tone: "cyan" as const,
    description:
      "One conversation replaces your workout logger, nutrition tracker, exercise database, meal planner, and progress journal. No more context switching between apps.",
  },
  {
    title: "Intelligent Tool Calling",
    icon: "Zap",
    tone: "blue" as const,
    description:
      "Real-time API integrations fetch current exercise data, nutrition info, and scientific research — not static knowledge cutoffs. Every recommendation is grounded in current data.",
  },
  {
    title: "Specialized AI Agents",
    icon: "Brain",
    tone: "purple" as const,
    description:
      "Dedicated agents for workout planning, exercise discovery, nutrition, and tracking. Each agent has specialized tools and knowledge for its domain, orchestrated by LangGraph.",
  },
  {
    title: "LangChain & LangGraph Orchestration",
    icon: "GitBranch",
    tone: "pink" as const,
    description:
      "Enterprise-grade agent orchestration with tool use, memory, guardrails, and observability. Parallel tool execution, structured output, and citation-backed responses.",
  },
  {
    title: "NVIDIA Nemotron Integration",
    icon: "Shield",
    tone: "green" as const,
    description:
      "Powered by NVIDIA Nemotron 3 Ultra — 53B parameter state-of-the-art LLM with 8K context, optimized for reasoning, tool use, and structured output.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Section 1 — Product Overview */}
      <section id="overview" className="about-section">
        <div className="container">
          <ScrollReveal delay={0} direction="up">
            <SectionHeading
              badge="Product Overview"
              title={
                <>
                  Everything You Need. <GradientText>One Intelligent Platform.</GradientText>
                </>
              }
              description="Macro unifies AI workout planning, exercise discovery, and personalized nutrition into one conversational platform. No more switching between apps — just tell Macro your goals, and it handles the rest."
            />
          </ScrollReveal>

          <ScrollReveal delay={150} direction="up">
            <div className="about-grid-auto about-grid-auto--3">
              {OVERVIEW_CARDS.map((card) => (
                <FeatureCard key={card.title} {...card} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 2 — Workout Intelligence */}
      <section id="workout-intelligence" className="about-section bg-[var(--grad-radial)]">
        <div className="container">
          <ScrollReveal delay={0} direction="up">
            <SectionHeading
              badge="Workout Intelligence"
              title={
                <>
                  Your Training, <GradientText>Smarter Than Ever.</GradientText>
                </>
              }
              description="AI that plans, adapts, and evolves with every rep you complete. From personalized generation to adaptive programming that grows with you."
            />
          </ScrollReveal>

          <ScrollReveal delay={150} direction="up">
            <div className="about-grid-2">
              {WORKOUT_CARDS.map((card) => (
                <FeatureCard key={card.title} {...card} />
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={250} direction="up">
            <FeaturePanel
              icon="Zap"
              title="Adaptive Programming That Evolves With You"
              className="about-stack-gap"
            >
              <div className="about-grid-3">
                {ADAPTIVE_FEATURES.map((item) => (
                  <PanelItem key={item.title} icon="CheckCircle" {...item} />
                ))}
              </div>
            </FeaturePanel>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 3 — Nutrition Intelligence */}
      <section id="nutrition-intelligence" className="about-section">
        <div className="container">
          <ScrollReveal delay={0} direction="up">
            <SectionHeading
              badge="Nutrition Intelligence"
              accent="green"
              title={
                <>
                  Nutrition That <GradientText variant="cyan">Works With Your Goals.</GradientText>
                </>
              }
              description="Meal planning that understands your protein targets, dietary preferences, and calorie needs — without the guesswork."
            />
          </ScrollReveal>

          <ScrollReveal delay={150} direction="up">
            <div className="about-grid-2">
              {NUTRITION_CARDS.map((card) => (
                <FeatureCard key={card.title} {...card} accent="green" />
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={250} direction="up">
            <FeaturePanel
              icon="Target"
              title="Precision Macro Tracking & Analytics"
              accent="green"
              className="about-stack-gap"
            >
              <div className="about-grid-4">
                {MACRO_METRICS.map((metric) => (
                  <MetricCard key={metric.label} {...metric} />
                ))}
              </div>
            </FeaturePanel>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 4 — AI Technology */}
      <section id="technology" className="about-section bg-[var(--grad-radial)]">
        <div className="container">
          <ScrollReveal delay={0} direction="up">
            <SectionHeading
              badge="AI Technology"
              title={
                <>
                  Intelligence <GradientText>Behind Every Recommendation.</GradientText>
                </>
              }
              description="Macro combines proven AI frameworks with fitness data to deliver guidance you can trust. Every architectural decision exists to remove friction between you and your goals."
            />
          </ScrollReveal>

          <ScrollReveal delay={150} direction="up">
            <div className="about-grid-auto about-grid-auto--5">
              {TECHNOLOGY_CARDS.map((card) => (
                <FeatureCard key={card.title} {...card} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 5 — Final CTA */}
      <section id="cta" className="about-section relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--grad-radial-strong)] pointer-events-none" aria-hidden="true" />
        <div className="container relative z-10">
          <ScrollReveal delay={0} direction="up">
            <div className="about-cta">
              <span className="about-badge about-badge--cyan">
                <Icon icon="Zap" size={14} />
                Early Access
              </span>
              <h2 className="about-cta__title">
                Ready to <GradientText>Experience Macro?</GradientText>
              </h2>
              <p className="about-cta__body">
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
