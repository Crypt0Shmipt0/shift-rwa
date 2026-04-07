import { NextResponse } from "next/server";
import { ASSETS } from "@/lib/mock";

export const revalidate = 600; // 10 min

type NewsItem = {
  id: string;
  title: string;
  source: string;
  time: string;
  image: string;
  link: string;
};

function clean(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function tag(block: string, name: string): string | null {
  const re = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i");
  const m = block.match(re);
  return m ? clean(m[1]) : null;
}

function imageFromBlock(block: string): string {
  const media = block.match(/<media:content[^>]+url="([^"]+)"/i);
  if (media) return media[1];
  const enc = block.match(/<enclosure[^>]+url="([^"]+)"/i);
  if (enc) return enc[1];
  const desc = block.match(/<description>([\s\S]*?)<\/description>/i);
  if (desc) {
    const img = desc[1].match(/<img[^>]+src="([^"]+)"/i);
    if (img) return img[1];
  }
  return "";
}

function relTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return "";
  const diff = Date.now() - t;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "JUST NOW";
  if (min < 60) return `${min} MIN AGO`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} HR AGO`;
  const day = Math.floor(hr / 24);
  return `${day} DAY${day === 1 ? "" : "S"} AGO`;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await ctx.params;
  const asset = ASSETS.find((a) => a.symbol === symbol);
  if (!asset) return NextResponse.json({ error: "Unknown symbol" }, { status: 404 });

  const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${asset.underlying}&region=US&lang=en-US`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ShiftRWA/1.0)" },
      next: { revalidate: 600 },
    });
    if (!res.ok) throw new Error(`yahoo rss ${res.status}`);
    const xml = await res.text();

    const items: NewsItem[] = [];
    const blocks = xml.split(/<item>/).slice(1);
    let i = 0;
    for (const raw of blocks) {
      if (i >= 6) break;
      const end = raw.indexOf("</item>");
      const block = end >= 0 ? raw.slice(0, end) : raw;
      const title = tag(block, "title") ?? "";
      const link = tag(block, "link") ?? "#";
      const pub = tag(block, "pubDate") ?? "";
      const src = link.match(/^https?:\/\/([^/]+)/)?.[1].replace(/^www\./, "") ?? "Yahoo";
      const image = imageFromBlock(block) || `/news/news-${(i % 4) + 1}.png`;
      if (!title) continue;
      items.push({
        id: `${asset.underlying}-${i}`,
        title,
        source: src,
        time: relTime(pub),
        image,
        link,
      });
      i++;
    }

    if (items.length === 0) throw new Error("no items parsed");
    return NextResponse.json({ symbol, underlying: asset.underlying, items });
  } catch {
    const fallback: NewsItem[] = [
      { id: "1", title: `${asset.name} update`,                       source: "Forbes",    time: "1 DAY AGO",  image: "/news/news-1.png", link: "#" },
      { id: "2", title: `${asset.underlying} market analysis`,        source: "Bloomberg", time: "10 MIN AGO", image: "/news/news-2.png", link: "#" },
      { id: "3", title: `Why ${asset.underlying} is moving today`,    source: "Reuters",   time: "1 HR AGO",   image: "/news/news-3.png", link: "#" },
      { id: "4", title: `${asset.underlying} price targets revised`,  source: "WSJ",       time: "2 HR AGO",   image: "/news/news-4.png", link: "#" },
    ];
    return NextResponse.json({ symbol, underlying: asset.underlying, items: fallback, fallback: true });
  }
}
