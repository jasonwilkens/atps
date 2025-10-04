import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/harrow",
        destination: "https://old.jasonwilkens.website/harrow",
        permanent: true,
      },
      {
        source: "/pathfinder/:slug",
        destination: "https://old.jasonwilkens.website/pathfinder/:slug",
        permanent: true,
      },
      {
        source: "/pathfinder",
        destination: "https://old.jasonwilkens.website/pathfinder",
        permanent: true,
      },
      {
        source: "/modern-pathfinder",
        destination: "https://old.jasonwilkens.website/modern-pathfinder",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
