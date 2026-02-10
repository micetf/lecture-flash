/**
 * Hook personnalisé pour charger et gérer des fichiers Markdown depuis CodiMD
 * Compatible uniquement avec codimd.apps.education.fr
 *
 * VERSION 3.0.0 : Restriction CodiMD only
 *
 * @module useMarkdownFromUrl
 * @returns {Object} État et fonctions de gestion du fichier Markdown
 */

import { useState, useEffect } from "react";

export function useMarkdownFromUrl() {
    const [markdown, setMarkdown] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sourceUrl, setSourceUrl] = useState("");
    const [speedConfig, setSpeedConfig] = useState(null);

    /**
     * Valide qu'une URL appartient à codimd.apps.education.fr
     * @param {string} url - URL à valider
     * @returns {boolean} true si l'URL est valide
     */
    const isValidCodiMdUrl = (url) => {
        if (!url) return false;

        try {
            const parsedUrl = new URL(url);
            return parsedUrl.hostname === "codimd.apps.education.fr";
        } catch {
            return false;
        }
    };

    /**
     * Transforme une URL CodiMD en URL de téléchargement direct (raw markdown)
     * @param {string} url - URL de partage CodiMD
     * @returns {string} URL de téléchargement direct
     * @throws {Error} Si l'URL n'est pas une URL CodiMD valide
     */
    const normalizeCloudUrl = (url) => {
        if (!url) return url;

        const trimmedUrl = url.trim();

        // Validation stricte : uniquement codimd.apps.education.fr
        if (!isValidCodiMdUrl(trimmedUrl)) {
            throw new Error(
                "Seules les URLs codimd.apps.education.fr sont acceptées."
            );
        }

        let normalizedUrl = trimmedUrl;

        // CodiMD/HedgeDoc : formats supportés
        // https://codimd.apps.education.fr/s/xxxxx (share link)
        // https://codimd.apps.education.fr/p/xxxxx (pad link)
        // On transforme en /download pour obtenir le raw markdown

        // Si l'URL contient /s/ ou /p/ et ne finit pas déjà par /download
        if (
            (normalizedUrl.includes("/s/") || normalizedUrl.includes("/p/")) &&
            !normalizedUrl.endsWith("/download")
        ) {
            // Supprimer les paramètres de query s'il y en a
            const urlWithoutQuery = normalizedUrl.split("?")[0];
            normalizedUrl = urlWithoutQuery + "/download";
        }

        return normalizedUrl;
    };

    /**
     * Charge le contenu Markdown depuis une URL CodiMD
     * @param {string} url - URL du document CodiMD
     */
    const loadMarkdownFromUrl = async (url) => {
        if (!url || url.trim() === "") {
            setError("Veuillez fournir une URL valide");
            return;
        }

        setLoading(true);
        setError(null);
        setSourceUrl(url);

        try {
            // Validation et normalisation
            const normalizedUrl = normalizeCloudUrl(url);
            console.log("📥 Chargement depuis CodiMD:", normalizedUrl);

            const response = await fetch(normalizedUrl, {
                method: "GET",
                headers: {
                    Accept: "text/plain, text/markdown, */*",
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Erreur ${response.status}: ${response.statusText}`
                );
            }

            const contentType = response.headers.get("content-type");

            // Vérifier que c'est bien du texte
            if (
                contentType &&
                !contentType.includes("text") &&
                !contentType.includes("markdown")
            ) {
                console.warn("Type de contenu inattendu:", contentType);
            }

            const text = await response.text();

            if (!text || text.trim() === "") {
                throw new Error("Le fichier est vide");
            }

            setMarkdown(text);
            setError(null);
            console.log("✅ Document CodiMD chargé avec succès");
        } catch (err) {
            console.error("❌ Erreur lors du chargement du fichier:", err);
            setError(
                err.message || "Impossible de charger le fichier depuis CodiMD"
            );
            setMarkdown("");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Récupère les paramètres depuis l'URL de la page
     * Scénario Digipad : ?url=ENCODED_CODIMD_URL&speed=180&locked=true
     *
     * @returns {Object} { url: string|null, speedConfig: { speed: number, locked: boolean }|null }
     */
    const getParamsFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const url =
            params.get("url") || params.get("fichier") || params.get("md");
        const speedParam = params.get("speed");
        const lockedParam = params.get("locked");

        let speedConfig = null;

        if (speedParam) {
            const speed = parseInt(speedParam, 10);
            if (!isNaN(speed) && speed >= 30 && speed <= 300) {
                speedConfig = {
                    speed: speed,
                    locked: lockedParam === "true" || lockedParam === "1",
                };
            } else {
                console.warn(
                    `Paramètre speed invalide : ${speedParam}. Ignoré.`
                );
            }
        }

        return { url, speedConfig };
    };

    /**
     * Charge automatiquement le fichier si une URL est présente dans les paramètres
     * Permet le scénario "lien depuis Digipad"
     */
    useEffect(() => {
        const { url, speedConfig: config } = getParamsFromUrl();

        if (url) {
            console.log(
                "🔗 URL détectée dans les paramètres, chargement auto..."
            );
            loadMarkdownFromUrl(url);
        }

        if (config) {
            setSpeedConfig(config);
            console.log(
                `⚙️ Configuration vitesse: ${config.speed} MLM (${
                    config.locked ? "verrouillée" : "suggérée"
                })`
            );
        }
    }, []);

    /**
     * Réinitialise l'état
     */
    const reset = () => {
        setMarkdown("");
        setError(null);
        setSourceUrl("");
        setLoading(false);
        setSpeedConfig(null);
        console.log("🔄 Hook réinitialisé");
    };

    return {
        markdown,
        loading,
        error,
        sourceUrl,
        speedConfig,
        loadMarkdownFromUrl,
        getParamsFromUrl,
        reset,
        normalizeCloudUrl,
        isValidCodiMdUrl,
    };
}
