import type { NextConfig } from "next";
import path from "node:path";

const config: NextConfig = {
  outputFileTracingRoot: path.resolve(import.meta.dirname, ".."),
  experimental: { optimizePackageImports: ["@phosphor-icons/react", "lucide-react"] },
};
export default config;
