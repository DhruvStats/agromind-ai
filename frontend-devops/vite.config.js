import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  /* ✅ IMPORTANT: expose to Docker */
  server: {
    host: "0.0.0.0",   // ✅ allows external access
    port: 5173,        // ✅ matches docker-compose
    strictPort: true   // ✅ avoids port switching issues
  }
});