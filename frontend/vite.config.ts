import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"development"',
    'process.env.REACT_APP_IGNORE_DEPRECATED_WARNINGS': '"true"'
  },
  resolve: {
    alias: {
      punycode: 'punycode',
    },
  },
  build: {
    sourcemap: true,
  },
  server: {
    open: true,
  },
});
