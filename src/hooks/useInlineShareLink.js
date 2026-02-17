/**
 * Hook de génération de lien de partage encodé
 *
 * Ce hook encapsule la logique de :
 * - Génération d'URL encodée avec garde-fous
 * - Copie dans le presse-papiers (avec fallback)
 * - Détermination si le partage encodé est possible
 *
 * @module hooks/useInlineShareLink
 * @version 1.0.0
 */

import { useMemo } from "react";
import {
    buildInlineShareUrl,
    MAX_INLINE_TEXT_LENGTH,
} from "../utils/urlSharing";

/**
 * Hook pour gérer la génération de lien de partage encodé
 *
 * @param {Object} appState - État application complet
 * @param {string} appState.text - Texte à partager
 * @param {number} appState.speedWpm - Vitesse MLM
 * @param {Object} optionsAffichage - Options d'affichage
 * @param {string} optionsAffichage.police - Police
 * @param {number} optionsAffichage.taille - Taille en %
 * @param {string} [theme="light"] - Thème visuel
 * @param {boolean} [allowStudentChanges=true] - Droit modification élève
 *
 * @returns {Object} Hook state et actions
 * @returns {boolean} returns.canShareInline - Indique si partage possible
 * @returns {string} returns.reasonIfNot - Raison si partage impossible
 * @returns {string|null} returns.inlineUrl - URL générée (null si impossible)
 * @returns {Function} returns.copyToClipboard - Fonction async de copie
 *
 * @example
 * function SpeedSelector({ appState, optionsAffichage }) {
 *   const { canShareInline, reasonIfNot, copyToClipboard } = useInlineShareLink(
 *     appState,
 *     optionsAffichage,
 *     "light",
 *     true
 *   );
 *
 *   const handleShare = async () => {
 *     const result = await copyToClipboard();
 *     if (result.ok) {
 *       alert('Lien copié !');
 *     } else {
 *       alert(`Erreur : ${result.error}`);
 *     }
 *   };
 *
 *   return (
 *     <button
 *       disabled={!canShareInline}
 *       onClick={handleShare}
 *       title={reasonIfNot}
 *     >
 *       Lien de lecture (sans stockage)
 *     </button>
 *   );
 * }
 */
export default function useInlineShareLink(
    appState,
    optionsAffichage,
    theme = "light",
    allowStudentChanges = true
) {
    /**
     * Calcul de la possibilité de partage et génération URL
     * Mémoïsé pour éviter recalcul à chaque render
     */
    const shareState = useMemo(() => {
        // Garde-fou 1 : Texte vide
        if (!appState.text || appState.text.trim().length === 0) {
            return {
                canShareInline: false,
                reasonIfNot: "Aucun texte à partager",
                inlineUrl: null,
            };
        }

        // Garde-fou 2 : Texte trop long
        if (appState.text.length > MAX_INLINE_TEXT_LENGTH) {
            return {
                canShareInline: false,
                reasonIfNot: `Texte trop long (${appState.text.length} caractères, maximum ${MAX_INLINE_TEXT_LENGTH}). Utilisez le partage CodiMD.`,
                inlineUrl: null,
            };
        }

        // Génération URL
        const baseUrl = window.location.origin + window.location.pathname;
        const url = buildInlineShareUrl(
            baseUrl,
            appState,
            optionsAffichage,
            theme,
            allowStudentChanges
        );

        // Garde-fou 3 : URL trop longue (échec buildInlineShareUrl)
        if (!url) {
            return {
                canShareInline: false,
                reasonIfNot:
                    "URL trop longue après compression. Utilisez le partage CodiMD pour ce texte.",
                inlineUrl: null,
            };
        }

        // Succès
        return {
            canShareInline: true,
            reasonIfNot: "",
            inlineUrl: url,
        };
    }, [
        appState.text,
        appState.speedWpm,
        optionsAffichage,
        theme,
        allowStudentChanges,
    ]);

    /**
     * Copie l'URL dans le presse-papiers avec fallback
     *
     * Stratégie :
     * 1. Tenter navigator.clipboard.writeText() (API moderne, nécessite HTTPS)
     * 2. Si échec, afficher prompt() avec URL pré-sélectionnée
     *
     * @returns {Promise<{ok: boolean, url?: string, error?: string}>}
     */
    const copyToClipboard = async () => {
        if (!shareState.canShareInline || !shareState.inlineUrl) {
            return {
                ok: false,
                error:
                    shareState.reasonIfNot || "Impossible de générer le lien",
            };
        }

        try {
            // Tentative API Clipboard (moderne)
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(shareState.inlineUrl);
                return { ok: true, url: shareState.inlineUrl };
            }

            // Fallback : prompt avec sélection automatique
            // Note : window.prompt() ne supporte pas la sélection auto,
            // mais affiche l'URL pour copie manuelle
            window.prompt(
                "Copiez ce lien (Ctrl+C ou Cmd+C) :",
                shareState.inlineUrl
            );

            return { ok: true, url: shareState.inlineUrl };
        } catch (error) {
            console.error("Erreur copie presse-papiers :", error);

            // Fallback ultime : prompt manuel
            window.prompt(
                "Impossible de copier automatiquement. Copiez ce lien manuellement :",
                shareState.inlineUrl
            );

            return {
                ok: false,
                error: "Copie automatique impossible. Lien affiché pour copie manuelle.",
                url: shareState.inlineUrl,
            };
        }
    };
    const buildShareUrl = (theme = "light", allowStudentChanges = true) => {
        if (!canShareInline) return null;

        return buildInlineShareUrl(
            baseReadingUrl,
            appState,
            optionsAffichage,
            theme,
            allowStudentChanges
        );
    };
    return {
        canShareInline: shareState.canShareInline,
        reasonIfNot: shareState.reasonIfNot,
        inlineUrl: shareState.inlineUrl,
        buildShareUrl,
        copyToClipboard,
    };
}
