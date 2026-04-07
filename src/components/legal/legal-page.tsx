import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Legal</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">{title}</h1>
        <div className="text-xs text-muted-foreground">Last updated: {updated}</div>
      </div>
      <article className="prose prose-invert max-w-none text-sm text-foreground/80 leading-relaxed [&_h2]:text-white [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-4 [&_li]:mb-1 [&_a]:text-mint [&_a]:underline hover:[&_a]:opacity-80">
        {children}
      </article>
    </div>
  );
}
