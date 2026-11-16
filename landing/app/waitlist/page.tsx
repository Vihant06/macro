import { Metadata } from "next";
import { Waitlist } from "@/components/macro/Waitlist";
import { GradientText } from "@/components/macro/ui/GradientText";

export const metadata: Metadata = {
  title: "Join Waitlist — Macro",
  description: "Join the Macro waitlist for early access. No credit card required. Cancel anytime.",
};

export default function WaitlistPage() {
  return (
    <>
      <section className="section relative overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0 bg-[var(--grad-radial-strong)] pointer-events-none" aria-hidden="true" />
        <div className="container-wide relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium mb-6">
              Early Access
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
              Ready to <GradientText>Train Smarter</GradientText>?
            </h1>
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
              Join thousands of early adopters getting first access to Macro. No credit card required.
            </p>
          </div>
        </div>
      </section>

      <Waitlist />

      <section className="section bg-[var(--grad-radial)]">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
              What Early Access Includes
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: "🤖", title: "Full AI Assistant", desc: "Workout & nutrition generation, exercise discovery, conversational coaching" },
                { icon: "📊", title: "Progress Tracking", desc: "Macro adherence, workout analytics, adaptation insights" },
                { icon: "🔄", title: "Lifetime Discount", desc: "Lock in 50% off Pro plan for life as a founding member" },
              ].map((item, i) => (
                <div key={i} className="glass rounded-2xl p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-medium text-white mb-2">{item.title}</h3>
                  <p className="text-white/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}