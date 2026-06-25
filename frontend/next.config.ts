import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  ...(isStaticExport && {
    output: 'export',
    basePath: '/apexfitnessnyc',
    assetPrefix: '/apexfitnessnyc/',
    trailingSlash: true,
  }),
};

export default nextConfig;
