import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ['172.17.106.110', '*.ngrok-free.app', '*.ngrok.io'],
  typescript: {
    // WASM bindings crash during type checking on ARM64 Mac — skip for dev
    ignoreBuildErrors: true,
  },
  webpack(config) {
    // next-intl requires this alias so it can find the getRequestConfig
    config.resolve.alias['next-intl/config'] = path.resolve('./i18n/request.ts');
    return config;
  },
  env: {
    _next_intl_trailing_slash: undefined,
  },
};

export default nextConfig;
