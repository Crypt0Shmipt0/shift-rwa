import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // Project-wide default: happy-dom gives component tests a real DOM without per-file docblocks.
    // Pure data/unit tests (e.g. tokens.test.ts) are unaffected — happy-dom is a superset of node.
    environment: "happy-dom",
    setupFiles: ["./src/vitest.setup.ts"],
  },
});
