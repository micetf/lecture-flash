import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

/**
 * Configuration Vite pour l'application Lecture Flash
 *
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
    plugins: [
        // Plugin React avec Fast Refresh
        react(),

        // Plugin pour importer les SVG comme composants React
        svgr({
            svgrOptions: {
                icon: true,
            },
        }),
    ],

    // Configuration du serveur de développement
    server: {
        port: 9000,
        open: true,
        host: true,
    },

    // Configuration du build
    build: {
        outDir: "build",
        sourcemap: true,

        // Optimisation du code splitting
        rollupOptions: {
            output: {
                manualChunks: {
                    "react-vendor": ["react", "react-dom"],
                },
            },
        },
    },

    // Configuration des alias de chemin
    resolve: {
        alias: {
            "@": "/src",
            "@components": "/src/components",
            "@hooks": "/src/hooks",
        },
    },
});
