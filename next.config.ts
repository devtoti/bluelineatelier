import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
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
        hostname: "automatic-bloom-06f2309866.strapiapp.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "automatic-bloom-06f2309866.media.strapiapp.com",
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
