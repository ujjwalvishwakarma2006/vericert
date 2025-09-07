import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@napi-rs/canvas"],
  },
};

export default nextConfig;

