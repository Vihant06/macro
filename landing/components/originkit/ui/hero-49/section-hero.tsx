// Delivered by Originkit · stack: nextjs · styling: tailwind
/* eslint-disable */
// @ts-nocheck
"use client"
import FibreArc from "@/components/originkit/ui/hero-49/fibre-arc";

export function SectionHero() {
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
        <div className="brand">weft</div>
        <nav className="links">
          <a href="#">How it reads</a>
          <a href="#">Privacy</a>
          <a href="#">Manifesto</a>
          <a href="#">Pricing</a>
        </nav>
        <a className="cta" href="#">
          Join the waitlist
        </a>
      </header>
      <main className="hero">
        <span className="eyebrow">
          <b>New</b>Ask across every app you write in
        </span>
        <h1>
          Every note you’ve ever taken, <em>woven into one thread.</em>
        </h1>
        <p className="sub">
          Weft reads your docs, chats and voice memos on your own machine, then answers in your
          words with the source one click away.
        </p>
        <div className="buttons">
          <a className="btn" href="#">
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
          <a className="link" href="#">
            <i>
              <svg width="10" height="12" viewBox="0 0 10 12" fill="#6FC8FF">
                <path d="M0 0l10 6-10 6z" />
              </svg>
            </i>
            Watch it untangle a week
          </a>
        </div>
        <div className="sources">
          <span>Reads from</span>
          <ul>
            <li>Notes</li>
            <li>Docs</li>
            <li>Chat</li>
            <li>Email</li>
            <li>Voice memos</li>
            <li>PDFs</li>
          </ul>
        </div>
      </main>
    </>
    </div>
  );
}
