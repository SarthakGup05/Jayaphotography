import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    process.env.ANALYZE &&
      visualizer({
        filename: "bundle-report.html",
        template: "treemap",
        gzipSize: true,
        brotliSize: true,
        open: true,
      }),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Extract the package name from the path
            const modules = id.toString().split("node_modules/")[1].split("/");
            let pkgName = modules[0];

            // Handle scoped packages like @react-three/fiber
            if (pkgName.startsWith("@")) {
              pkgName = `${pkgName}/${modules[1]}`;
            }

            return `vendor-${pkgName.replace("@", "")}`;
          }
        },
      },
    },
  },
});
