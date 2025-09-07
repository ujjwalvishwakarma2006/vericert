import type { NextConfig } from "next";

// Enable standalone output so we can build a slimmer production image for Akash.
// This produces the .next/standalone folder with only the files needed to run.
const nextConfig: NextConfig = {
  serverExternalPackages: ["@napi-rs/canvas"],
  output: "standalone",
};

export default nextConfig;

