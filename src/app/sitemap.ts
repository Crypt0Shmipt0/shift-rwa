import type { MetadataRoute } from "next";
import { getAllPosts } from "@/data/blog-posts";
import { TOKENS } from "@/data/tokens";

const BASE_URL = "https://shift-rwa.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "", "/markets", "/portfolio", "/history", "/leaderboard", "/rewards",
    "/referrals", "/learn", "/airdrop", "/blog", "/disclaimer", "/privacy",
    "/terms", "/status",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.7,
  }));

  const blogRoutes = getAllPosts().map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const tradeRoutes = TOKENS.map((t) => ({
    url: `${BASE_URL}/trade/${t.shiftTicker}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes, ...tradeRoutes];
}
