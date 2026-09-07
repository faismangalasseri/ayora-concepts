// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Vercel/Netlify need their own Nitro bundle. Without this, the shared
  // config defaults to a Cloudflare bundle and the host deploys no routes.
  ...(process.env["VERCEL"]
    ? { nitro: { preset: "vercel" } }
    : process.env["NETLIFY"]
      ? { nitro: { preset: "netlify" } }
      : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // All pages are static marketing content — prerender them to HTML.
    pages: [
      { path: "/" },
      { path: "/designs" },
      { path: "/concept/serif" },
      { path: "/concept/editorial" },
      { path: "/concept/noir" },
      { path: "/concept/kinetic" },
    ],
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
  },
});
