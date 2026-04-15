import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.googleapis.com' }, // google cloud bucket
    ],
  },
};

export default nextConfig;