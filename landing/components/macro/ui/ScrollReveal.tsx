"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import * as React from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "scale" | "none";
}

export function ScrollReveal({ 
  children, 
  delay = 0, 
  threshold = 0.1, 
  rootMargin = "0px 0px -50px 0px",
  once = true,
  className = "",
  direction = "up"
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, threshold, rootMargin, once]);

  const directionStyles = {
    up: "translate-y-10",
    down: "-translate-y-10",
    left: "translate-x-10",
    right: "-translate-x-10",
    scale: "scale-95",
    none: "",
  };

  const baseStyles = "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]";
  const visibleStyles = "opacity-100 translate-x-0 translate-y-0 scale-100";
  const hiddenStyles = `opacity-0 ${directionStyles[direction]}`;

  return (
    <div 
      ref={elementRef} 
      className={`${baseStyles} ${isVisible ? visibleStyles : hiddenStyles} ${className}`}
    >
      {children}
    </div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  baseDelay?: number;
  staggerDelay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "scale" | "none";
}

export function StaggerContainer({ 
  children, 
  baseDelay = 0, 
  staggerDelay = 100, 
  className = "",
  direction = "up"
}: StaggerContainerProps) {
  const childrenArray = Array.isArray(children) ? children : [children];
  
  return (
    <div className={className}>
      {childrenArray.map((child, index) => 
        React.isValidElement(child) ? (
          React.cloneElement(child as React.ReactElement<any>, {
            key: index,
            delay: baseDelay + index * staggerDelay,
            direction,
          })
        ) : child
      )}
    </div>
  );
}