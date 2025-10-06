import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    proxy: {
      // all API requests will be proxied to Frappe backend
      "/api": {
        target: "http://127.0.0.1:8001",
        changeOrigin: true,
        secure: false, // Frappe runs on HTTP in dev
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
