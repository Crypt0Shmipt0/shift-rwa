import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getFeaturedPosts, getThumbnail } from "@/data/blog-posts";
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
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-24">
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
              {/* Thumbnail */}
              <div className="relative h-36 w-full flex-shrink-0 overflow-hidden bg-[#0a2730]">
                <Image
                  src={getThumbnail(post)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2730] via-[#0A2730]/30 to-transparent" />
                <span
                  className={`absolute bottom-3 left-3 text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full backdrop-blur-sm ${TAG_COLORS[post.tag]}`}
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
                <div className="flex items-center justify-between text-xs text-foreground/35 pt-3 border-t border-border/40">
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
