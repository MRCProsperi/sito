import type { NextConfig } from "next";

// Static export: the site is built to ./out and uploaded to the Aruba (Apache) hosting.
// Redirects from the old WordPress URLs live in public/.htaccess, because
// next.config redirects are not applied to static exports.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
