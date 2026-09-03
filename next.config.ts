import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin is a Node library with optional native deps; requiring it at
  // runtime instead of bundling it keeps the build off OpenTelemetry.
  serverExternalPackages: ["firebase-admin"],};

export default nextConfig;
