import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        force: true,
    },
    server: {
        hmr: true,
        port: 5003,
    },
});
