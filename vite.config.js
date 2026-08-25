import { defineConfig } from "vite";

export default defineConfig({
    server: {
        open: true,
    },
    build: {
        // Small images get inlined as data URIs; larger ones are hashed and cached forever.
        assetsInlineLimit: 4096,
    },
});
