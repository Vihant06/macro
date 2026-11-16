import { Icon } from "@/components/macro/ui/Icon";
import type { AboutAccent, AboutTone } from "./SectionHeading";

interface FeatureCardProps {
  icon: string;
  tone?: AboutTone;
  accent?: AboutAccent;
  title: string;
  description: string;
  chips?: string[];
  className?: string;
}

export function FeatureCard({
  icon,
  tone = "cyan",
  accent = "cyan",
  title,
  description,
  chips,
  className = "",
}: FeatureCardProps) {
  const isGreen = accent === "green";

  return (
    <article className={`about-card ${isGreen ? "about-card--green" : ""} ${className}`}>
      <div className="about-card__icon">
        <Icon icon={icon} size={24} className={`about-tone-${tone}`} />
      </div>
      <h3 className="about-card__title">{title}</h3>
      <p className="about-card__body">{description}</p>
      {chips && chips.length > 0 ? (
        <div className="about-chips">
          {chips.map((chip) => (
            <span key={chip} className={`about-chip ${isGreen ? "about-chip--green" : ""}`}>
              {chip}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
