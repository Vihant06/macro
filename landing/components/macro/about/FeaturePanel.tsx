import type { ReactNode } from "react";
import { Icon } from "@/components/macro/ui/Icon";
import type { AboutAccent, AboutTone } from "./SectionHeading";

interface FeaturePanelProps {
  icon: string;
  title: string;
  accent?: AboutAccent;
  children: ReactNode;
  className?: string;
}

export function FeaturePanel({
  icon,
  title,
  accent = "cyan",
  children,
  className = "",
}: FeaturePanelProps) {
  const isGreen = accent === "green";

  return (
    <div className={`about-panel about-panel--${accent} ${className}`}>
      <div className="about-panel__head">
        <div className="about-panel__icon">
          <Icon icon={icon} size={24} className={isGreen ? "about-tone-green" : "about-tone-cyan"} />
        </div>
        <h3 className="about-panel__title">{title}</h3>
      </div>
      {children}
    </div>
  );
}

interface PanelItemProps {
  icon: string;
  title: string;
  description: string;
  accent?: AboutAccent;
}

export function PanelItem({ icon, title, description, accent = "cyan" }: PanelItemProps) {
  const isGreen = accent === "green";

  return (
    <div className={`about-panel-item ${isGreen ? "about-panel-item--green" : ""}`}>
      <div className="about-panel-item__icon">
        <Icon icon={icon} size={18} className={isGreen ? "about-tone-green" : "about-tone-cyan"} />
      </div>
      <div>
        <h4 className="about-panel-item__title">{title}</h4>
        <p className="about-panel-item__text">{description}</p>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: string;
  tone: AboutTone;
  label: string;
  description: string;
}

export function MetricCard({ icon, tone, label, description }: MetricCardProps) {
  return (
    <div className="about-metric">
      <div className="about-metric__icon">
        <Icon icon={icon} size={22} className={`about-tone-${tone}`} />
      </div>
      <h4 className="about-metric__label">{label}</h4>
      <p className="about-metric__text">{description}</p>
    </div>
  );
}
