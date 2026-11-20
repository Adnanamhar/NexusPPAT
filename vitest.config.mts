import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/lib/**/*.ts"],
      exclude: [
        "src/lib/supabase/**",
        "src/lib/service-templates.ts",
        "src/lib/cn.ts",
        "src/lib/guides.ts",
        "src/lib/permissions.ts",
      ],
    },
  },
});
