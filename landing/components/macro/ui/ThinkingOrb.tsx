"use client";

import { ThinkingOrb as Orb } from "thinking-orbs";
import { useEffect, useState } from "react";

type OrbState = "working" | "searching" | "solving" | "listening" | 
  "connecting" | "weaving" | "composing" | "breathing" | "shaping";

interface ThinkingOrbProps {
  state: OrbState;
  size?: 64 | 20;
  speed?: number;
  paused?: boolean;
  className?: string;
}

export function ThinkingOrb({ 
  state, 
  size = 64, 
  speed = 1, 
  paused = false, 
  className = "" 
}: ThinkingOrbProps) {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <Orb 
      state={state} 
      size={size} 
      speed={speed} 
      paused={paused || prefersReduced}
      className={className}
    />
  );
}

const STATE_SEQUENCE: OrbState[] = ["searching", "weaving", "composing", "solving"];

export function useThinkingOrbState(isActive: boolean, phaseDuration = 800) {
  const [stateIndex, setStateIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setIsVisible(false);
      setStateIndex(0);
      return;
    }

    setIsVisible(true);
    const interval = setInterval(() => {
      setStateIndex((prev) => (prev + 1) % STATE_SEQUENCE.length);
    }, phaseDuration);

    return () => clearInterval(interval);
  }, [isActive, phaseDuration]);

  return {
    state: STATE_SEQUENCE[stateIndex],
    isVisible,
  };
}