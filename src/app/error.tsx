"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("shift error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] mx-auto max-w-xl px-6 py-20 flex flex-col items-center text-center gap-6">
      <div className="size-16 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-white mb-2">Something broke.</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          The trade desk hit an unexpected error. The rest of Shift is still running — you can retry, head home, or check status.
        </p>
        {error.digest && (
          <p className="text-xs text-slate mt-3 font-mono">ref: {error.digest}</p>
        )}
      </div>
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Button onClick={reset} className="bg-mint text-primary-foreground hover:bg-mint/90">
          <RotateCw className="h-4 w-4" />
          Try again
        </Button>
        <Link href="/" className="inline-flex items-center gap-2 h-9 px-4 rounded-md border border-border bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors">
          <Home className="h-4 w-4" />
          Go home
        </Link>
        <Link href="/status" className="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium hover:bg-secondary transition-colors">
          System status
        </Link>
      </div>
    </div>
  );
}
