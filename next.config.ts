import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveExtensions: ['.mjs', '.js', '.jsx', '.json', '.wasm']
  }
};

export default nextConfig;
