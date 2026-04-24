"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const reactId = useId();
  const emailId = `newsletter-email-${reactId}`;
  const helpId = `newsletter-help-${reactId}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="border border-border/60 bg-[#0A2730] rounded-2xl px-6 py-10 text-center">
      <div className="inline-flex items-center gap-2 bg-mint/15 border border-mint/40 text-mint text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-4">
        <span className="size-1.5 rounded-full bg-mint" />
        SHIFT Signal
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Subscribe to the SHIFT Signal</h2>
      <p className="text-sm text-foreground/55 mb-6">
        New signals + analysis in your inbox. No spam.
      </p>
      {status === "success" ? (
        <p className="text-mint font-semibold text-sm">You&apos;re in — watch your inbox.</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <Input
            id={emailId}
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby={helpId}
            required
            className="flex-1 bg-white/5 border-border/60 text-white placeholder:text-foreground/40 focus-visible:ring-mint/40"
          />
          <p id={helpId} className="sr-only">
            Subscribe to The SHIFT Signal newsletter. We will email new signals and analysis — no spam.
          </p>
          <Button
            type="submit"
            disabled={status === "loading"}
            className="bg-mint text-primary-foreground font-semibold hover:bg-mint/90 rounded-full px-6 shrink-0"
          >
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </Button>
        </form>
      )}
      {status === "error" && (
        <p className="text-red-400 text-xs mt-3">Something went wrong — please try again.</p>
      )}
    </div>
  );
}
