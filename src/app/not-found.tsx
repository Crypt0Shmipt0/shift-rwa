import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] mx-auto max-w-xl px-6 py-20 flex flex-col items-center text-center gap-6">
      <div className="size-16 rounded-2xl bg-mint/10 border border-mint/30 flex items-center justify-center">
        <Compass className="h-7 w-7 text-mint" />
      </div>
      <div>
        <h1 className="text-6xl font-bold text-white mb-3 tabular-nums">404</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          Nothing here. Maybe you followed an old link, or maybe this market isn&apos;t listed yet.
        </p>
      </div>
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-mint text-primary-foreground text-sm font-semibold hover:bg-mint/90 transition-colors"
        >
          <Home className="h-4 w-4" />
          Go home
        </Link>
        <Link
          href="/markets"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-md border border-border bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          Browse markets
        </Link>
      </div>
    </div>
  );
}
