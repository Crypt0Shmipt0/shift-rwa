import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BLOG_POSTS, getPost, getThumbnail, getAuthor } from "@/data/blog-posts";
import type { BlogTag } from "@/data/blog-posts";
import { NewsletterForm } from "@/components/blog/newsletter-form";

const BASE_URL = "https://shift-rwa.vercel.app";

export function generateStaticParams() {
  // Only generate pages for published (non-draft) posts
  return BLOG_POSTS.filter((p) => !p.draft).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.draft) return {};
  return {
    title: `${post.title} — SHIFT Finance`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
    },
  };
}

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

/** Get up to 3 related published posts matching the same tag, excluding current slug, newest-first */
function getRelatedPosts(slug: string, tag: BlogTag, limit = 3) {
  return BLOG_POSTS.filter((p) => !p.draft && p.slug !== slug && p.tag === tag)
    .slice()
    .sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1))
    .slice(0, limit);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post || post.draft) notFound();

  const relatedPosts = getRelatedPosts(slug, post.tag);

  // JSON-LD — static internal data
  const articleLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: getAuthor(post) },
    publisher: {
      "@type": "Organization",
      name: "SHIFT",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/brand/shift-lockup-gradient-light.png` },
    },
    mainEntityOfPage: `${BASE_URL}/blog/${post.slug}`,
  });

  return (
    <main className="min-h-screen bg-[#021C24]">
      {/* eslint-disable-next-line react/no-danger -- JSON-LD is static internal data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleLd }} />
      {/* Back link */}
      <div className="mx-auto max-w-[1200px] px-6 pt-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-mint transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to blog
        </Link>
      </div>

      {/* Article header */}
      <header className="mx-auto max-w-[680px] px-6 pt-10 pb-10">
        <span
          className={`inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-6 ${TAG_COLORS[post.tag]}`}
        >
          {TAG_LABELS[post.tag]}
        </span>
        <h1 className="text-3xl md:text-[2.5rem] font-bold text-white tracking-tight leading-[1.15] mb-4">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-xl text-foreground/60 font-normal mb-6">{post.subtitle}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-foreground/40">
          <span>{getAuthor(post)}</span>
          <span className="w-px h-3 bg-foreground/20" />
          <span>{formatDate(post.publishedAt)}</span>
          <span className="w-px h-3 bg-foreground/20" />
          <span>{post.readingMinutes} min read</span>
        </div>
      </header>

      {/* Hero image */}
      <div className="mx-auto max-w-[960px] px-6 mb-12">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/60 bg-[#0a2730]">
          <Image
            src={getThumbnail(post)}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 1024px) 960px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Article body — constrained to 680px for ~65-70 chars/line readability */}
      <article className="mx-auto max-w-[680px] px-6 pb-20">
        <div className="text-[17px] md:text-[18px] leading-[1.75] text-foreground/85">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ ...props }) => (
                <h2
                  className="text-2xl md:text-3xl font-bold mt-12 mb-4 text-white tracking-tight"
                  {...props}
                />
              ),
              h3: ({ ...props }) => (
                <h3
                  className="text-xl font-semibold mt-8 mb-3 text-white"
                  {...props}
                />
              ),
              p: ({ ...props }) => <p className="mb-5" {...props} />,
              blockquote: ({ ...props }) => (
                <blockquote
                  className="border-l-4 border-mint pl-5 my-8 italic text-foreground/70"
                  {...props}
                />
              ),
              a: ({ ...props }) => (
                <a
                  className="text-mint hover:underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              ul: ({ ...props }) => (
                <ul
                  className="list-disc list-outside pl-6 space-y-2 my-4"
                  {...props}
                />
              ),
              ol: ({ ...props }) => (
                <ol
                  className="list-decimal list-outside pl-6 space-y-2 my-4"
                  {...props}
                />
              ),
              li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
              strong: ({ ...props }) => (
                <strong className="font-semibold text-white/90" {...props} />
              ),
              em: ({ ...props }) => <em className="italic text-foreground/75" {...props} />,
              hr: () => <hr className="border-border/60 my-10" />,
              code: ({ ...props }) => (
                <code
                  className="bg-white/10 text-mint text-[0.85em] px-1.5 py-0.5 rounded font-mono"
                  {...props}
                />
              ),
            }}
          >
            {post.body}
          </ReactMarkdown>
        </div>
      </article>

      {/* Newsletter subscribe */}
      <div className="mx-auto max-w-[680px] px-6 pb-16">
        <NewsletterForm />
      </div>

      {/* Read next */}
      {relatedPosts.length > 0 && (
        <div className="border-t border-border/60">
          <div className="mx-auto max-w-[1200px] px-6 py-16">
            <h2 className="text-2xl font-bold text-white mb-2">Read next.</h2>
            <p className="text-foreground/50 text-sm mb-8">More from {TAG_LABELS[post.tag]}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group flex flex-col rounded-2xl border border-border/60 bg-[#0A2730] hover:border-mint/40 hover:bg-[#0d2f38] transition-all duration-200 overflow-hidden"
                >
                  <div className="relative h-40 w-full flex-shrink-0 overflow-hidden bg-[#0a2730]">
                    <Image
                      src={getThumbnail(related)}
                      alt={related.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A2730] via-[#0A2730]/20 to-transparent" />
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-mint transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-foreground/55 text-sm leading-relaxed line-clamp-2 flex-1">
                      {related.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-foreground/40 pt-4 mt-4 border-t border-border/40">
                      <span>{formatDate(related.publishedAt)}</span>
                      <span>{related.readingMinutes} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA footer */}
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-[680px] px-6 py-14 text-center">
          <p className="text-foreground/50 text-sm mb-2">Ready to trade tokenized stocks?</p>
          <h2 className="text-2xl font-bold text-white mb-6">
            Start trading on SHIFT — 24/7, on-chain.
          </h2>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 bg-mint text-primary-foreground font-semibold text-base px-7 py-3.5 rounded-full hover:bg-mint/90 active:-translate-y-px transition-all shadow-[0_0_30px_rgba(38,200,184,0.3)]"
          >
            Open the app
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <div className="mt-8">
            <Link
              href="/blog"
              className="text-sm text-foreground/40 hover:text-mint transition-colors"
            >
              ← Back to all articles
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
