import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/workouts", destination: "/about", permanent: true },
      { source: "/nutrition", destination: "/about", permanent: true },
      { source: "/features", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;