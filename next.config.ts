import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
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
