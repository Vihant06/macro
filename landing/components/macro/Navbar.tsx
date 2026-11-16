"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, MessageCircle, Dumbbell } from "lucide-react";
import { useState } from "react";
import { GradientText } from "./ui/GradientText";
import { Icon } from "./ui/Icon";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <nav className="container px-6" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-3" aria-label="Macro Home">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <MessageCircle size={22} className="text-black" aria-hidden="true" />
            </div>
            <span className="text-xl md:text-2xl font-light italic font-serif text-white hidden sm:block">
              Macro
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors relative py-2 ${
                  pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                    ? "text-cyan-400"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
                {(pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </Link>
            ))}
            <Link
              href="/waitlist"
              className="btn-primary text-sm px-6 py-2.5 h-auto"
            >
              Join Waitlist
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-white/10 animate-slide-down">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-2 py-3 text-base font-medium rounded-lg transition-colors ${
                    pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/waitlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary text-center mt-2"
              >
                Join Waitlist
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}