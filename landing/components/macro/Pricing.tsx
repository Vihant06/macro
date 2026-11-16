"use client";

import { useState } from "react";
import { Check, X, Star } from "lucide-react";
import { ScrollReveal, StaggerContainer } from "./ui/ScrollReveal";
import { GradientText } from "./ui/GradientText";
import { Icon } from "./ui/Icon";

const PRICING_TIERS = [
  {
    name: "Free",
    price: 0,
    period: "/month",
    description: "Perfect for trying out Macro",
    features: [
      { text: "3 workout generations/month", included: true },
      { text: "Basic exercise search", included: true },
      { text: "5 meal plan generations/month", included: true },
      { text: "Community support", included: true },
      { text: "Unlimited workout generations", included: false },
      { text: "Advanced exercise discovery", included: false },
      { text: "AI conversation history", included: false },
      { text: "Progress tracking & analytics", included: false },
      { text: "Priority support", included: false },
      { text: "API access", included: false },
    ],
    cta: "Get Started",
    variant: "ghost" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: 19,
    period: "/month",
    description: "For serious fitness enthusiasts",
    features: [
      { text: "3 workout generations/month", included: true },
      { text: "Basic exercise search", included: true },
      { text: "5 meal plan generations/month", included: true },
      { text: "Community support", included: true },
      { text: "Unlimited workout generations", included: true },
      { text: "Advanced exercise discovery", included: true },
      { text: "AI conversation history", included: true },
      { text: "Progress tracking & analytics", included: true },
      { text: "Priority support", included: true },
      { text: "API access", included: false },
    ],
    cta: "Join Waitlist",
    variant: "primary" as const,
    popular: true,
    badge: "Most Popular",
  },
  {
    name: "Team",
    price: 49,
    period: "/month",
    description: "For coaches, gyms, and teams",
    features: [
      { text: "3 workout generations/month", included: true },
      { text: "Basic exercise search", included: true },
      { text: "5 meal plan generations/month", included: true },
      { text: "Community support", included: true },
      { text: "Unlimited workout generations", included: true },
      { text: "Advanced exercise discovery", included: true },
      { text: "AI conversation history", included: true },
      { text: "Progress tracking & analytics", included: true },
      { text: "Priority support", included: true },
      { text: "API access", included: true },
    ],
    cta: "Contact Sales",
    variant: "secondary" as const,
    popular: false,
    badge: "Up to 5 members",
  },
];

const FAQ = [
  {
    q: "Can I switch plans later?",
    a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately, and we'll prorate the difference.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "We offer a 14-day money-back guarantee on Pro. Try it risk-free — if it's not for you, get a full refund.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, and bank transfers for annual Team plans.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Cancel in one click from your settings. No questions asked, no retention calls.",
  },
];

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="section bg-[var(--grad-radial)] mb-16">
      <div className="container">
        <StaggerContainer baseDelay={0} staggerDelay={100} direction="up">
          <ScrollReveal delay={0}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium mb-6">
                Simple, Transparent Pricing
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                Choose Your <GradientText>Plan</GradientText>
              </h2>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-8">
                No hidden fees. No lock-in. Cancel anytime.
              </p>
              <div className="inline-flex items-center gap-4 p-1 bg-black/30 rounded-xl">
                {["monthly", "yearly"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setBillingPeriod(period as "monthly" | "yearly")}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      billingPeriod === period
                        ? "bg-white/10 text-white shadow-md"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {period === "monthly" ? "Monthly" : "Yearly"}
                    {period === "yearly" && <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">Save 20%</span>}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {PRICING_TIERS.map((tier, index) => (
                <PricingCard key={tier.name} tier={tier} index={index} billingPeriod={billingPeriod} />
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="max-w-2xl mx-auto mb-16">
              <h3 className="text-2xl md:text-3xl font-light font-serif text-center text-white mb-10">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {FAQ.map((item, i) => (
                  <FAQItem key={i} question={item.q} answer={item.a} index={i} />
                ))}
              </div>
            </div>
          </ScrollReveal>
        </StaggerContainer>
      </div>
    </section>
  );
}

function PricingCard({ tier, index, billingPeriod }: { tier: typeof PRICING_TIERS[0]; index: number; billingPeriod: "monthly" | "yearly" }) {
  const price = billingPeriod === "yearly" ? Math.round(tier.price * 12 * 0.8) : tier.price;
  const period = billingPeriod === "yearly" ? "/year" : tier.period;

  return (
    <div className={`relative glass rounded-2xl p-8 flex flex-col ${tier.popular ? "border-cyan-400/30 shadow-[0_0_40px_rgba(27,79,216,0.15)]" : "border-white/10"}`}>
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-400 to-blue-600 text-black text-xs font-medium rounded-full">
          {tier.badge}
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-medium text-white mb-2">{tier.name}</h3>
        <p className="text-white/50 text-sm">{tier.description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-5xl md:text-6xl font-bold text-white">{price}</span>
          <span className="text-white/40 text-lg">{period}</span>
        </div>
        {billingPeriod === "yearly" && tier.price > 0 && (
          <p className="text-green-400 text-sm">Billed yearly — save 20%</p>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1" role="list">
        {tier.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={`flex-shrink-0 w-5 h-5 rounded-lg flex items-center justify-center ${feature.included ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/30"}`}>
              {feature.included ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={2} />}
            </span>
            <span className={`text-sm ${feature.included ? "text-white/80" : "text-white/40"}`}>{feature.text}</span>
          </li>
        ))}
      </ul>

      <button className={`w-full ${tier.variant === "primary" ? "btn-primary" : tier.variant === "secondary" ? "btn-secondary" : "btn-ghost"}`}>
        {tier.cta}
      </button>
    </div>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass rounded-xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-white pr-4">{question}</span>
        <Icon icon={Star} size={20} className={`text-cyan-400 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 pb-5 border-t border-white/5">
          <p className="text-white/60 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}