import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="relative bg-primary text-primary-foreground py-12 md:py-16 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="container-portal relative">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">
          Portal da Câmara
        </p>
        <h1 className="font-display text-3xl md:text-5xl font-bold">{title}</h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-primary-foreground/80 text-lg">{subtitle}</p>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold" />
    </section>
  );
}
