import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    watch: {
      ignored: ["**/.next/**", "**/dist/**", "**/coverage/**"],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@/lib/router": path.resolve(__dirname, "./src/lib/router-vite.tsx"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
