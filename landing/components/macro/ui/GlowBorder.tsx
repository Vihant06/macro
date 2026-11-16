"use client";

import { ReactNode } from "react";

interface GlowBorderProps {
  children: ReactNode;
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
  hover?: boolean;
}

export function GlowBorder({ children, className = "", intensity = "medium", hover = true }: GlowBorderProps) {
  const intensityClasses = {
    subtle: "border-white/5 hover:border-cyan-400/20",
    medium: "border-white/10 hover:border-cyan-400/40",
    strong: "border-cyan-400/20 hover:border-cyan-400/60",
  };

  const glowClasses = {
    subtle: "hover:shadow-[0_0_20px_rgba(27,79,216,0.15)]",
    medium: "hover:shadow-[0_0_30px_rgba(27,79,216,0.25),0_0_0_1px_rgba(111,200,255,0.2)]",
    strong: "hover:shadow-[0_0_40px_rgba(111,200,255,0.35),0_0_0_1px_rgba(111,200,255,0.3)]",
  };

  const transitionClass = hover 
    ? "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" 
    : "";

  return (
    <div className={`relative rounded-2xl bg-white/5 backdrop-blur-xl ${intensityClasses[intensity]} ${glowClasses[intensity]} ${transitionClass} ${className}`}>
      {children}
    </div>
  );
}