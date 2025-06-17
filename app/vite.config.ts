import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Set base path for GitHub Pages when in production
  // This will be the repository name in GitHub Pages (e.g., /community-box/)
  const base = mode === 'production' ? '/community-box/' : '/';

  return {
    base,
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@research": path.resolve(__dirname, "../research"),
      },
    },
  };
});
