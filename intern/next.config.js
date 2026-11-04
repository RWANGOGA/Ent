/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_EXPORT === "1";

const nextConfig = {
  reactStrictMode: true,
  // Static export for GitHub Pages (NEXT_EXPORT=1 in CI).
  // assetPrefix "./" makes asset URLs relative, so the build works
  // under any repo name / subpath without configuring basePath.
  ...(isExport
    ? {
        output: "export",
        assetPrefix: "./",
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

module.exports = nextConfig;
