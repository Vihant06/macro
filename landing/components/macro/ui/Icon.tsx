"use client";

import { 
  Layers, 
  Zap, 
  Brain, 
  Shield, 
  GitBranch, 
  User, 
  Search, 
  Flame, 
  Leaf, 
  Dumbbell, 
  Utensils, 
  Target, 
  Code, 
  CheckCircle, 
  Menu,
  Zap as ZapIcon,
  Flame as FlameIcon,
  Leaf as LeafIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  // Main icons
  Layers,
  Zap,
  ZapIcon,
  Brain,
  Shield,
  GitBranch,
  User,
  Search,
  Flame,
  Leaf,
  Dumbbell,
  Utensils,
  Target,
  Code,
  CheckCircle,
  FlameIcon,
  LeafIcon,
  SearchIcon,
  Menu,
  MenuIcon,
} as const;

interface IconProps {
  icon: LucideIcon | string;
  size?: number;
  className?: string;
  ariaHidden?: boolean;
}

export function Icon({ 
  icon: IconComponent, 
  size = 24, 
  className = "", 
  ariaHidden = true 
}: IconProps) {
  const Component = typeof IconComponent === "string" 
    ? ICON_MAP[IconComponent] 
    : IconComponent;
  
  return (
    <Component 
      size={size} 
      className={className} 
      aria-hidden={ariaHidden}
      strokeWidth={1.5}
    />
  );
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon | string;
  size?: number;
  variant?: "ghost" | "primary" | "secondary";
  label: string;
}

export function IconButton({ 
  icon: IconComponent, 
  size = 20, 
  variant = "ghost", 
  label, 
  className = "",
  children,
  ...props 
}: IconButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200";
  
  const variantStyles = {
    ghost: "text-white/60 hover:text-white hover:bg-white/10",
    primary: "bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(27,79,216,0.5)]",
    secondary: "border border-cyan-400/40 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400",
  };
  
  const Component = typeof IconComponent === "string" 
    ? ICON_MAP[IconComponent] 
    : IconComponent;

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      aria-label={label}
      {...props}
    >
      <Component size={size} aria-hidden="true" strokeWidth={2} />
      {children && <span>{children}</span>}
    </button>
  );
}