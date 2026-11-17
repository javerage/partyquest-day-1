import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // The starter ships without tests; the first one is written in D1·B2.1.
    passWithNoTests: true,
  },
});
