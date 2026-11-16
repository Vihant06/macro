import { Metadata } from "next";
import { Pricing } from "@/components/macro/Pricing";

export const metadata: Metadata = {
  title: "Pricing — Macro",
  description: "Simple, transparent pricing for Macro. Free, Pro, and Team plans. No hidden fees. Cancel anytime.",
};

export default function PricingPage() {
  return (
    <>
      <Pricing />

      <section className="section bg-[var(--grad-radial)] text-center">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
            Still Have Questions?
          </h2>
          <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
            Check our FAQ or reach out to our team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/waitlist" className="btn-primary">Join Waitlist</a>
            <a href="#contact" className="btn-secondary">Contact Sales</a>
          </div>
        </div>
      </section>
    </>
  );
}