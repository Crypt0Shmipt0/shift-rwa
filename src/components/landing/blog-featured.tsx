import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedPosts } from "@/data/blog-posts";
import type { BlogTag } from "@/data/blog-posts";

const TAG_LABELS: Record<BlogTag, string> = {
  signal: "The SHIFT Signal",
  academy: "Shift Academy",
  general: "General",
};

const TAG_COLORS: Record<BlogTag, string> = {
  signal: "bg-mint/15 text-mint border border-mint/30",
  academy: "bg-[#07638C]/20 text-[#4CC8E8] border border-[#07638C]/40",
  general: "bg-white/10 text-white/70 border border-white/20",
};

const CARD_GRADIENTS: Record<BlogTag, string> = {
  signal: "linear-gradient(135deg, #0a2730 0%, #0e3d4a 50%, #26C8B825 100%)",
  academy: "linear-gradient(135deg, #0a2730 0%, #07314a 50%, #07638C30 100%)",
  general: "linear-gradient(135deg, #0a2730 0%, #1a2e30 50%, #26C8B815 100%)",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function LandingBlogFeatured() {
  const posts = getFeaturedPosts(4);
  if (posts.length === 0) return null;

  return (
    <section className="relative border-t border-border/60">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-mint/15 border border-mint/40 text-mint text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5">
              <span className="size-1.5 rounded-full bg-mint" />
              From the blog
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-[-0.03em] leading-[1.1]">
              Read the SHIFT thesis.
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-mint text-sm font-medium hover:underline underline-offset-4 whitespace-nowrap"
          >
            View all
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Cards grid — responsive: 1 col → 2 col → up to 4 for 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-border/60 bg-[#0A2730] hover:border-mint/40 hover:bg-[#0d2f38] transition-all duration-200 overflow-hidden"
            >
              {/* Gradient thumbnail */}
              <div
                className="h-32 w-full flex-shrink-0 flex items-end p-4"
                style={{ background: CARD_GRADIENTS[post.tag] }}
              >
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${TAG_COLORS[post.tag]}`}
                >
                  {TAG_LABELS[post.tag]}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5">
                <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-mint transition-colors line-clamp-3">
                  {post.title}
                </h3>
                <p className="text-foreground/55 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-[11px] text-foreground/35 pt-3 border-t border-border/40">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>{post.readingMinutes} min</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
