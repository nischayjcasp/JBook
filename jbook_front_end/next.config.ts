import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "xsgames.co",
      },
      // {
      //   protocol: "https",
      //   hostname: "lh3.googleusercontent.com",
      //   pathname: "**",
      // },
    ],
  },
};

export default nextConfig;
