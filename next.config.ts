import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep native modules (lightningcss / @tailwindcss/node) external to the
  // server bundle so Turbopack builds can resolve their platform binaries.
  serverExternalPackages: ["@tailwindcss/node", "lightningcss"],
};

export default nextConfig;
