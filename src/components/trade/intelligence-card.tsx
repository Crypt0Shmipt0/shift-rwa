"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type NewsItem = {
  id: string;
  title: string;
  source: string;
  time: string;
  image: string;
  link: string;
};

const FALLBACK: NewsItem[] = [
  { id: "1", title: "Tesla Reveals introduced its latest robot, expanding its long-term robotics.", source: "Forbes",    time: "1 DAY AGO",  image: "/news/news-1.png", link: "#" },
  { id: "2", title: "Nvidia Expands Its Lead in AI Chips, signing agreement with Capitol Hill",     source: "Bloomberg", time: "10 MIN AGO", image: "/news/news-2.png", link: "#" },
  { id: "3", title: "Apple Launches Revolutionary Augmented Reality Glasses",                       source: "Bloomberg", time: "10 MIN AGO", image: "/news/news-3.png", link: "#" },
  { id: "4", title: "Uranium Gains as growing support for nuclear energy driving renewed interest.", source: "Bloomberg", time: "10 MIN AGO", image: "/news/news-4.png", link: "#" },
];

export function IntelligenceCard({ symbol = "TSL2L" }: { symbol?: string }) {
  const [items, setItems] = useState<NewsItem[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/news/${symbol}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: { items: NewsItem[] }) => {
        if (cancelled) return;
        if (j.items?.length) setItems(j.items.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return (
    <div className="bg-card rounded-3xl p-5 md:p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg text-foreground">Intelligence</h3>
        {loading && <span className="text-xs text-mist">Loading…</span>}
      </div>
      <ul className="space-y-5">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 group"
            >
              <div className="size-14 md:size-16 rounded-lg overflow-hidden shrink-0 bg-secondary relative">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                  unoptimized={item.image.startsWith("http")}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base leading-snug text-white group-hover:text-mint transition-colors line-clamp-3">
                  {item.title}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                  <span className="truncate">{item.source}</span>
                  <span className="uppercase shrink-0 ml-2">{item.time}</span>
                </div>
              </div>
            </a>
            {i < items.length - 1 && <div className="h-px bg-border mt-5" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
