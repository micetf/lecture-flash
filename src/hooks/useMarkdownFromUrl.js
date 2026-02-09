import { useState, useEffect } from "react";

/**
 * Hook personnalisé pour charger et gérer des fichiers Markdown depuis une URL cloud
 * Compatible avec Dropbox, Nextcloud, Nuage, Google Drive, etc.
 * @returns {Object} État et fonctions de gestion du fichier Markdown
 */
export function useMarkdownFromUrl() {
    const [markdown, setMarkdown] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sourceUrl, setSourceUrl] = useState("");

    /**
     * Transforme une URL de partage cloud en URL de téléchargement direct
     * @param {string} url - URL de partage
     * @returns {string} URL de téléchargement direct
     */
    const normalizeCloudUrl = (url) => {
        if (!url) return url;

        let normalizedUrl = url.trim();

        // Dropbox : remplacer www.dropbox.com par dl.dropboxusercontent.com
        // et s'assurer que dl=1 est présent
        if (normalizedUrl.includes("dropbox.com")) {
            normalizedUrl = normalizedUrl.replace(
                "www.dropbox.com",
                "dl.dropboxusercontent.com"
            );
            normalizedUrl = normalizedUrl.replace("dl=0", "dl=1");
            if (!normalizedUrl.includes("dl=")) {
                normalizedUrl += normalizedUrl.includes("?")
                    ? "&dl=1"
                    : "?dl=1";
            }
        }

        // Google Drive : extraire l'ID et créer l'URL de téléchargement
        if (normalizedUrl.includes("drive.google.com")) {
            const fileIdMatch = normalizedUrl.match(/[-\w]{25,}/);
            if (fileIdMatch) {
                normalizedUrl = `https://drive.google.com/uc?export=download&id=${fileIdMatch[0]}`;
            }
        }

        // Nextcloud / Nuage : s'assurer que download=1 est présent
        if (
            normalizedUrl.includes("nextcloud") ||
            normalizedUrl.includes("apps.education.fr")
        ) {
            if (normalizedUrl.includes("/s/")) {
                normalizedUrl += normalizedUrl.includes("?")
                    ? "&download=1"
                    : "/download";
            }
        }

        return normalizedUrl;
    };

    /**
     * Charge le contenu Markdown depuis une URL
     * @param {string} url - URL du fichier Markdown
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
            const normalizedUrl = normalizeCloudUrl(url);

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
        } catch (err) {
            console.error("Erreur lors du chargement du fichier:", err);
            setError(err.message || "Impossible de charger le fichier");
            setMarkdown("");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Récupère l'URL depuis les paramètres de l'URL de la page
     * @returns {string|null} URL du fichier ou null
     */
    const getUrlFromParams = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("url") || params.get("fichier") || params.get("md");
    };

    /**
     * Charge automatiquement le fichier si une URL est présente dans les paramètres
     */
    useEffect(() => {
        const urlParam = getUrlFromParams();
        if (urlParam) {
            loadMarkdownFromUrl(urlParam);
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
    };

    return {
        markdown,
        loading,
        error,
        sourceUrl,
        loadMarkdownFromUrl,
        getUrlFromParams,
        reset,
        normalizeCloudUrl,
    };
}
