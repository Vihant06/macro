// Delivered by Originkit · stack: nextjs · styling: tailwind
/* eslint-disable */
// @ts-nocheck
"use client"
import FibreArc from "@/components/originkit/ui/hero-49/fibre-arc";

export function SectionHeroMacro() {
  return (
    <div className="hero-49">
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
          hover={200}
          reach={23}
          bundle={{ curve: 20, spread: 100, thickness: 100, comb: 170 }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div className="scrim" />
      <header className="nav">
        <div className="brand">Macro</div>
        <nav className="links">
          <a href="#workouts">Workouts</a>
          <a href="#nutrition">Nutrition</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <a className="cta" href="#waitlist">
          Join the waitlist
        </a>
      </header>
      <main className="hero">
        <span className="eyebrow">
          <b>New</b>AI-Powered Fitness & Nutrition Assistant
        </span>
        <h1>
          Train Smarter. <em>Eat Better.</em> Achieve More.
        </h1>
        <p className="sub">
          Personalized workout plans, intelligent exercise discovery, and AI-driven nutrition guidance — all in one conversational platform. Powered by LangChain agents and NVIDIA Nemotron LLMs.
        </p>
        <div className="buttons">
          <a className="btn" href="#waitlist">
            Get early access{" "}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
          <a className="link" href="#demo">
            <i>
              <svg width="10" height="12" viewBox="0 0 10 12" fill="#6FC8FF">
                <path d="M0 0l10 6-10 6z" />
              </svg>
            </i>
            Watch the demo
          </a>
        </div>
        <div className="sources">
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