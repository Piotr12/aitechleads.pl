import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Trace from the monorepo root so the standalone build includes hoisted node_modules and
  // the workspace packages.
  outputFileTracingRoot: path.join(import.meta.dirname, "../.."),
  // Load the ORM from node_modules at runtime instead of bundling it (native SQLite binding,
  // dynamic requires).
  serverExternalPackages: ["@mikro-orm/sqlite", "@mikro-orm/sql", "@mikro-orm/migrations"],
  cacheComponents: true,
  partialPrefetching: true,
  // One canonical host: the OAuth state cookie and the session cookie live on aitechleads.pl.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.aitechleads.pl" }],
        destination: "https://aitechleads.pl/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // A man is not dead while his name is still spoken.
          { key: "X-Clacks-Overhead", value: "GNU Terry Pratchett" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
