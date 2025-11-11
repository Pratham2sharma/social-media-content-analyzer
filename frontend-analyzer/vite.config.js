import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    /**
     * This is the fix.
     * The warning you saw ("es2015") is too old.
     * 'esnext' tells Vite to use modern JavaScript features,
     * which correctly supports 'import.meta.env'.
     */
    target: "esnext",
  },
});
