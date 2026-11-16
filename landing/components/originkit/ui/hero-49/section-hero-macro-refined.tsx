// Delivered by Originkit · stack: nextjs · styling: tailwind
/* eslint-disable */
// @ts-nocheck
"use client"
import FibreArc from "@/components/originkit/ui/hero-49/fibre-arc";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export function SectionHeroMacroRefined() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const progress = Math.min(Math.max(scrollY / (heroHeight * 0.6), 0), 1);
      setScrollProgress(progress);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      setMousePos({ x: touch.clientX / window.innerWidth, y: touch.clientY / window.innerHeight });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [reducedMotion]);

  const glowOpacity = 0.4 + scrollProgress * 0.4;
  const glowX = 50 + (mousePos.x - 0.5) * 40;
  const glowY = 40 + (mousePos.y - 0.5) * 40;

  return (
    <div className="hero-49-refined">
    <>
      <div id="fibre">
        <FibreArc
          background="#01030A"
          baseColor="#1B4FD8"
          accentColor="#6FC8FF"
          highlight="#FFFFFF"
          density={26}
          speed={100}
          direction={0}
          hover={240}
          reach={35}
          bundle={{ curve: 16, spread: 130, thickness: 160, comb: 240 }}
          style={{ width: "100%", height: "100%" }}
        />
        <div
          ref={glowRef}
          className="hero-glow"
          style={{
            opacity: glowOpacity,
            background: `radial-gradient(ellipse at ${glowX}% ${glowY}%, rgba(111, 200, 255, 0.2) 0%, rgba(27, 79, 216, 0.1) 35%, rgba(1, 3, 10, 0) 65%)`,
          }}
        />
      </div>
      <div className="scrim-refined" />
      <main className="hero-refined">
        <span className="eyebrow-refined">
          AI-Powered Fitness & Nutrition Assistant
        </span>
        <h1 className="headline">
          Train Smarter. <em className="gradient-text">Eat Better.</em> Achieve More.
        </h1>
        <p className="sub-refined">
          Your personal AI-powered fitness and nutrition companion. Plan smarter workouts, discover exercises, and build better nutrition habits with intelligent AI assistance.
        </p>
        <div className="buttons-refined">
          <Link className="btn-refined btn-primary" href="/waitlist">
            Get Early Access{" "}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
        <div className="sources-refined">
          <span>Powered by</span>
          <ul>
            <li>LangChain</li>
            <li>NVIDIA Nemotron</li>
            <li>Tool Calling</li>
            <li>API Integrations</li>
          </ul>
        </div>
      </main>
    </>
    </div>
  );
}
