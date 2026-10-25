import type { NextConfig } from "next";

// GitHub Pages statik barındırma: sunucu yok, çıktı `out/` klasörüne yazılır.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
