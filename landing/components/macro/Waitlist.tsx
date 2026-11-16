"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, CheckCircle, Mail } from "lucide-react";
import { ScrollReveal } from "./ui/ScrollReveal";
import { GradientText } from "./ui/GradientText";
import { Icon } from "./ui/Icon";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isDisabled = status === "loading" || status === "success";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    setMessage("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, replace with actual API call
    // const response = await fetch('/api/waitlist', { method: 'POST', body: JSON.stringify({ email }) });
    
    setStatus("success");
    setMessage("You're on the list! We'll be in touch soon.");
    setEmail("");
  };

  return (
    <section id="waitlist" className="section relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--grad-radial-strong)] pointer-events-none" aria-hidden="true" />
      <div className="container-narrow relative">
        <ScrollReveal delay={0} direction="up">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium mb-6">
              Join the Movement
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
              Ready to <GradientText>Train Smarter</GradientText>?
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
              Join thousands of early adopters getting first access to Macro. No credit card required.
            </p>

            {status === "success" ? (
              <div className="glass rounded-2xl p-8 md:p-12 border border-green-500/30 max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-2">You're In!</h3>
                <p className="text-white/60 mb-6">{message}</p>
                <p className="text-sm text-white/40">Check your inbox for confirmation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Icon icon={Mail} size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-5 py-4 pl-12 pr-12 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all font-sans text-base"
                      disabled={isDisabled}
                      required
                      autoComplete="email"
                      aria-label="Email address for waitlist"
                    />
                    {status === "loading" && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 animate-pulse">
                        <Icon icon={ArrowRight} size={20} />
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isDisabled || !email}
                    className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-busy={status === "loading"}
                  >
                    {status === "loading" ? (
                      <>
                        <Icon icon={ArrowRight} size={18} className="animate-spin" />
                        Joining…
                      </>
                    ) : (
                      "Join Waitlist"
                    )}
                  </button>
                </div>
                {status === "error" && (
                  <p className="text-red-400 text-sm text-center mb-2">{message}</p>
                )}
                <p className="text-sm text-white/40 text-center">
                  By signing up, you agree to our{" "}
                  <a href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</a>
                  {" "}and{" "}
                  <a href="/terms" className="text-cyan-400 hover:underline">Terms of Service</a>
                  .
                </p>
              </form>
            )}

            <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 text-white/40 text-sm">
              <div className="flex items-center gap-2">
                <Icon icon={CheckCircle} size={16} className="text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon={CheckCircle} size={16} className="text-green-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon={CheckCircle} size={16} className="text-green-400" />
                <span>Early access perks</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}