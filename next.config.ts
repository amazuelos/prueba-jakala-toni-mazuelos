import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dulces-petalos.jakala.es',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
