import type { ReactNode } from "react";

export type AboutTone = "cyan" | "blue" | "green" | "purple" | "pink" | "yellow" | "red";
export type AboutAccent = "cyan" | "green";

interface SectionHeadingProps {
  badge: string;
  accent?: AboutAccent;
  title: ReactNode;
  description: string;
}

export function SectionHeading({
  badge,
  accent = "cyan",
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="about-head">
      <span className={`about-badge about-badge--${accent}`}>{badge}</span>
      <h2 className="about-title">{title}</h2>
      <p className="about-lede">{description}</p>
    </div>
  );
}
