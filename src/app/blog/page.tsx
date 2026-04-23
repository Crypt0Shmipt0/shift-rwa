import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts, getThumbnail } from "@/data/blog-posts";
import type { BlogTag } from "@/data/blog-posts";

const BASE_URL = "https://shift-rwa.vercel.app";

export const metadata: Metadata = {
  title: "Blog — SHIFT Finance",
  description:
    "The SHIFT Signal, Shift Academy, and long-form coverage of tokenized equities, RWAs, and the future of on-chain finance.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — SHIFT Finance",
    description:
      "The SHIFT Signal, Shift Academy, and long-form coverage of tokenized equities, RWAs, and the future of on-chain finance.",
    url: "/blog",
  },
};

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
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SHIFT Finance Blog",
    description: "The SHIFT Signal, Shift Academy, and long-form coverage of tokenized equities, RWAs, and on-chain finance.",
    url: `${BASE_URL}/blog`,
    publisher: { "@type": "Organization", name: "SHIFT" },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      datePublished: p.publishedAt,
      url: `${BASE_URL}/blog/${p.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-[#021C24]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
      />
      {/* Header */}
      <div className="border-b border-border/60">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
          <div className="inline-flex items-center gap-2 bg-mint/15 border border-mint/40 text-mint text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-6">
            <span className="size-1.5 rounded-full bg-mint" />
            From the blog
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-[-0.03em] leading-[1.05] mb-4">
            Read the SHIFT thesis.
          </h1>
          <p className="text-lg text-foreground/60 max-w-[560px]">
            Signals, deep-dives, and education on tokenized equities, RWAs, and the infrastructure
            reshaping global capital markets.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-border/60 bg-[#0A2730] hover:border-mint/40 hover:bg-[#0d2f38] transition-all duration-200 overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative h-48 w-full flex-shrink-0 overflow-hidden bg-[#0a2730]">
                <Image
                  src={getThumbnail(post)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2730] via-[#0A2730]/20 to-transparent" />
                <span
                  className={`absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm ${TAG_COLORS[post.tag]}`}
                >
                  {TAG_LABELS[post.tag]}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                <h2 className="text-white font-semibold text-lg leading-snug mb-2 group-hover:text-mint transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.subtitle && (
                  <p className="text-foreground/50 text-sm mb-3 line-clamp-1">{post.subtitle}</p>
                )}
                <p className="text-foreground/65 text-sm leading-relaxed mb-5 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-foreground/40 pt-4 border-t border-border/40">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>{post.readingMinutes} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
