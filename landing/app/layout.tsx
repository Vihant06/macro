import type { Metadata } from "next";
import "./globals.css";
import { manrope, inter } from "./fonts";
import { Navbar } from "@/components/macro/Navbar";
import { Footer } from "@/components/macro/Footer";

export const metadata: Metadata = {
  title: "Macro — AI-Powered Fitness & Nutrition Assistant",
  description: "Your workouts, nutrition, and fitness goals — all connected through one intelligent AI companion. Get personalized workout plans, discover exercises, and create nutrition plans tailored to your lifestyle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-screen">
        <Navbar />
        <main id="main-content" className="pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}