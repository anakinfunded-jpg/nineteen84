import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
  },
  serverExternalPackages: ["pdf-parse", "adm-zip"],
};

export default nextConfig;
