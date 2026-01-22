// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "out",
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "",
  assetPrefix: "./",
  trailingSlash: true,
}

module.exports = nextConfig
