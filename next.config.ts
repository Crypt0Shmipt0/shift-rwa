import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "**.yimg.com" },
      { protocol: "https", hostname: "s.yimg.com" },
      { protocol: "https", hostname: "media.zenfs.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
