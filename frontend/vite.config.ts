import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Development only: the browser calls same-origin relative /api paths and Vite
// forwards them to the local API, so no CORS policy is needed.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    cors: false,
    proxy: { "/api": { target: "http://127.0.0.1:8787", changeOrigin: false } },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
    // The starter ships without tests; the first UI test is written in D1·B2.4.
    passWithNoTests: true,
  },
});
