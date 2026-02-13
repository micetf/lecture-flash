/**
 * Hook personnalisé pour charger et gérer des fichiers Markdown depuis CodiMD
 * Compatible uniquement avec codimd.apps.education.fr
 *
 * VERSION 3.9.0 : Ajout filtrage titres H1 Markdown
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
     * Filtre les titres H1 Markdown d'un texte
     * Supprime les lignes commençant par '# ' (titre H1 uniquement)
     * Conserve les sous-titres H2, H3, etc. (##, ###)
     *
     * @param {string} text - Texte Markdown brut
     * @returns {string} Texte sans les titres H1
     *
     * @example
     * const text = "# Titre Principal\n## Sous-titre\nContenu";
     * const filtered = filtrerTitresMarkdown(text);
     * // Retourne : "## Sous-titre\nContenu"
     */
    const filtrerTitresMarkdown = (text) => {
        if (!text) return "";

        return text
            .split("\n")
            .filter((line) => {
                const trimmedLine = line.trim();
                // Supprimer uniquement les titres H1 (# suivi d'un espace)
                // Conserver H2+ (##, ###, etc.)
                return (
                    !trimmedLine.startsWith("# ") ||
                    trimmedLine.startsWith("## ")
                );
            })
            .join("\n");
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

            // 🆕 v3.9.0 : Filtrage des titres H1 Markdown
            const texteSansTitres = filtrerTitresMarkdown(text);

            setMarkdown(texteSansTitres);
            setError(null);
            console.log(
                "✅ Document CodiMD chargé avec succès (titres H1 filtrés)"
            );
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
     * Extrait la configuration de vitesse depuis les paramètres URL
     * Format attendu : ?speed=70&locked=true
     */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const speed = params.get("speed");
        const locked = params.get("locked");

        if (speed) {
            setSpeedConfig({
                speed: parseInt(speed, 10),
                locked: locked === "true",
            });
            console.log("⚙️ Configuration vitesse détectée:", {
                speed,
                locked,
            });
        }
    }, []);

    /**
     * Charge automatiquement le texte si une URL est passée en paramètre
     * Format : ?url=https://codimd.apps.education.fr/s/xxxxx
     */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlParam = params.get("url");

        if (urlParam) {
            console.log("🔗 URL détectée dans les paramètres:", urlParam);
            loadMarkdownFromUrl(urlParam);
        }
    }, []);

    /**
     * Réinitialise tous les états du hook
     * Utilisé pour le bouton "Réessayer"
     */
    const reset = () => {
        setMarkdown("");
        setLoading(false);
        setError(null);
        setSourceUrl("");
        setSpeedConfig(null);
        console.log("🔄 Hook useMarkdownFromUrl réinitialisé");
    };

    return {
        markdown,
        loading,
        error,
        sourceUrl,
        speedConfig,
        loadMarkdownFromUrl,
        isValidCodiMdUrl,
        reset,
    };
}

export default useMarkdownFromUrl;
