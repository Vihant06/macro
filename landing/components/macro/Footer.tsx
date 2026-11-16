"use client";

import { MessageCircle, Dumbbell, X, GitBranch, Building2, Send, Mail } from "lucide-react";
import { GradientText } from "./ui/GradientText";
import { Icon } from "./ui/Icon";

const FOOTER_LINKS = {
  product: [
    { label: "About Macro", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Join Waitlist", href: "/waitlist" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "#blog" },
    { label: "Careers", href: "#careers" },
    { label: "Press", href: "#press" },
    { label: "Contact", href: "#contact" },
  ],
  resources: [
    { label: "Documentation", href: "#docs" },
    { label: "API Reference", href: "#api" },
    { label: "Community", href: "#community" },
    { label: "Help Center", href: "#help" },
    { label: "Status", href: "#status" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Security", href: "/security" },
  ],
};

const SOCIAL_LINKS = [
  { icon: Send, href: "https://x.com/macro", label: "X" },
  { icon: GitBranch, href: "https://github.com/macro", label: "GitHub" },
  { icon: Building2, href: "https://linkedin.com/company/macro", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@macro.fit", label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12 mb-16">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <MessageCircle size={24} className="text-black" />
              </div>
              <span className="text-2xl font-light italic font-serif text-white">Macro</span>
            </div>
            <p className="text-white/70 text-base leading-relaxed max-w-xs mb-6">
              Train Smarter. <GradientText variant="cyan">Eat Better.</GradientText> Achieve More.
            </p>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Your AI-powered fitness & nutrition assistant. Built with LangChain, NVIDIA Nemotron, and a passion for human performance.
            </p>
          </div>

          <nav aria-label="Product">
            <h4 className="text-sm font-medium tracking-wide text-white mb-5">Product</h4>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/65 hover:text-white transition-colors text-sm leading-relaxed">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h4 className="text-sm font-medium tracking-wide text-white mb-5">Company</h4>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/65 hover:text-white transition-colors text-sm leading-relaxed">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h4 className="text-sm font-medium tracking-wide text-white mb-5">Resources</h4>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/65 hover:text-white transition-colors text-sm leading-relaxed">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h4 className="text-sm font-medium tracking-wide text-white mb-5">Legal</h4>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/65 hover:text-white transition-colors text-sm leading-relaxed">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Macro. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-cyan-400/30 hover:bg-white/10 transition-all duration-200"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon icon={social.icon} size={18} />
                </a>
              ))}
            </div>

            <div className="md:hidden flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-cyan-400/30 hover:bg-white/10 transition-all duration-200"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon icon={social.icon} size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}