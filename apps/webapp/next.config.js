import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@facet/config", "@facet/domain", "@facet/reframing", "@facet/ui"],
  turbopack: {
    root: path.join(__dirname, "../..")
  }
};

export default nextConfig;
