import type { NextConfig } from "next";

function getBackendRemotePattern() {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return null;
  }

  try {
    const parsed = new URL(backendUrl);
    return {
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
      pathname: "/**",
    };
  } catch {
    return null;
  }
}

const backendPattern = getBackendRemotePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.onrender.com",
        pathname: "/**",
      },
      ...(backendPattern ? [backendPattern] : []),
    ],
  },
};

export default nextConfig;
