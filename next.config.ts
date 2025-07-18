import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
   images: {
     remotePatterns: [
     {
        protocol: "https",
       hostname: "ik.imagekit.io",
         port: "",
       },
     ],
   },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
