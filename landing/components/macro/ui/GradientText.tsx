"use client";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "cyan";
}

export function GradientText({ children, className = "", variant = "default" }: GradientTextProps) {
  const baseClass = variant === "cyan" ? "text-gradient-cyan" : "text-gradient";
  return (
    <span className={`${baseClass} ${className}`}>
      {children}
    </span>
  );
}