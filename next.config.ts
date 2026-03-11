import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Disable so Server Component edits (e.g. h1 text) show up on refresh in dev
    serverComponentsHmrCache: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upbeat-talent-6d5a2283ac.strapiapp.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "upbeat-talent-6d5a2283ac.media.strapiapp.com",
        pathname: "/**",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
  ...(process.env.NODE_ENV === "development" && {
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            { key: "Access-Control-Allow-Origin", value: "*" },
            { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
            { key: "Access-Control-Allow-Headers", value: "RSC, Next-Router-State-Tree, Next-Url" },
          ],
        },
      ];
    },
  }),
};

export default nextConfig;
