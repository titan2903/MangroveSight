import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Expose 'global' to fix issues with legacy plugins expecting it
    global: "globalThis",
  },
  optimizeDeps: {
    exclude: ["maplibre-gl"],
  },
  build: {
    rollupOptions: {
      output: {
        // manualChunks must be a Function in Vite 8 (Rolldown)
        manualChunks(id) {
          if (id.includes("maplibre-gl")) {
            return "maplibre";
          }
        },
      },
    },
  },
});
