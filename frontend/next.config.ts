import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,  // or `true` if you want it permanently
      },
    ]
  },
}

export default nextConfig;
