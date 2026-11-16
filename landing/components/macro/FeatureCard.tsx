"use client";

import { LucideIcon } from "lucide-react";
import { ScrollReveal } from "./ui/ScrollReveal";
import { Icon } from "./ui/Icon";
import { GradientText } from "./ui/GradientText";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: "cyan" | "blue" | "purple" | "green" | "orange" | "pink";
  delay?: number;
  index?: number;
}

const ACCENT_STYLES = {
  cyan: { ring: "ring-cyan-400/30", iconBg: "bg-cyan-400/10", iconColor: "text-cyan-400", border: "border-cyan-400/20" },
  blue: { ring: "ring-blue-500/30", iconBg: "bg-blue-500/10", iconColor: "text-blue-400", border: "border-blue-500/20" },
  purple: { ring: "ring-purple-500/30", iconBg: "bg-purple-500/10", iconColor: "text-purple-400", border: "border-purple-500/20" },
  green: { ring: "ring-green-500/30", iconBg: "bg-green-500/10", iconColor: "text-green-400", border: "border-green-500/20" },
  orange: { ring: "ring-orange-500/30", iconBg: "bg-orange-500/10", iconColor: "text-orange-400", border: "border-orange-500/20" },
  pink: { ring: "ring-pink-500/30", iconBg: "bg-pink-500/10", iconColor: "text-pink-400", border: "border-pink-500/20" },
};

export function FeatureCard({ 
  icon: IconComponent, 
  title, 
  description, 
  accent = "cyan", 
  delay = 0,
  index = 0
}: FeatureCardProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <ScrollReveal delay={delay} direction="up" className="group">
      <article className={`relative glass rounded-2xl p-6 md:p-8 h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/20 ${styles.border} hover:${styles.ring} hover:shadow-[0_0_40px_${styles.iconColor.replace("text-", "")}0033]`}>
        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${styles.ring.replace("ring", "shadow-[0_0_30px_")}]]`} aria-hidden="true" />
        
        <div className="relative z-10">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${styles.iconBg} ${styles.iconColor} mb-5 group-hover:scale-110 transition-transform duration-300`}>
            <Icon icon={IconComponent} size={28} />
          </div>
          
          <h3 className="text-xl md:text-2xl font-medium text-white mb-3 tracking-tight">
            {title}
          </h3>
          
          <p className="text-white/60 leading-relaxed mb-6">
            {description}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-white/40 group-hover:text-cyan-400/80 transition-colors">
            <span>Explore</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="transition-transform group-hover:translate-x-1" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}