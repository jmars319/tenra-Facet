import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@facet/api-contracts",
    "@facet/config",
    "@facet/domain",
    "@facet/reframing",
    "@facet/search-providers",
    "@facet/ui",
    "@facet/validation"
  ],
  turbopack: {
    root: path.join(__dirname, "../..")
  }
};

export default nextConfig;
