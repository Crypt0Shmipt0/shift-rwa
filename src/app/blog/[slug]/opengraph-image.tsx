import { renderOg, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getPost } from "@/data/blog-posts";

export const alt = "SHIFT Blog Post";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "nodejs";

const TAG_EYEBROW: Record<string, string> = {
  signal: "The SHIFT Signal",
  academy: "Shift Academy",
  general: "SHIFT Blog",
};

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post || post.draft) {
    return renderOg({
      eyebrow: "SHIFT Blog",
      title: "Read the SHIFT thesis.",
    });
  }

  return renderOg({
    eyebrow: TAG_EYEBROW[post.tag] ?? "SHIFT Blog",
    title: post.title.length > 60 ? post.title.slice(0, 57) + "…" : post.title,
    subtitle: post.subtitle ?? post.excerpt.slice(0, 120),
  });
}
