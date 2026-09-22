import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Safe for static exports and local testing without external image server
  },
};

export default nextConfig;
