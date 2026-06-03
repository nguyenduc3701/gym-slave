import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typescript: {
    // WASM bindings crash during type checking on ARM64 Mac — skip for dev
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
