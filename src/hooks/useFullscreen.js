/**
 * Hook personnalisé pour gérer le mode plein écran
 *
 * Fonctionnalités :
 * - Activation/désactivation plein écran via API Fullscreen native
 * - Détection support API (Safari iOS non supporté)
 * - Gestion événements fullscreenchange et fullscreenerror
 * - État synchronisé avec changements externes (touche Escape)
 * - Fallback gracieux si API non disponible
 *
 * @module hooks/useFullscreen
 *
 * @example
 * // Utilisation basique
 * const {
 *   estPleinEcran,
 *   entrerPleinEcran,
 *   sortirPleinEcran,
 *   basculerPleinEcran,
 *   estSupporte
 * } = useFullscreen();
 *
 * // Bouton toggle
 * <button onClick={basculerPleinEcran} disabled={!estSupporte}>
 *   {estPleinEcran ? '⛿ Quitter' : '⛶ Plein écran'}
 * </button>
 */

import { useState, useEffect, useCallback } from "react";

/**
 * Hook pour gérer le mode plein écran
 *
 * @returns {Object} Interface de gestion plein écran
 * @returns {boolean} returns.estPleinEcran - État actuel plein écran
 * @returns {Function} returns.entrerPleinEcran - Fonction pour activer
 * @returns {Function} returns.sortirPleinEcran - Fonction pour désactiver
 * @returns {Function} returns.basculerPleinEcran - Fonction toggle
 * @returns {boolean} returns.estSupporte - Support API navigateur
 */
export default function useFullscreen() {
    // État plein écran
    const [estPleinEcran, setEstPleinEcran] = useState(false);

    /**
     * Vérifie si l'API Fullscreen est supportée par le navigateur
     * Note: Safari iOS ne supporte pas l'API Fullscreen
     */
    const estSupporte =
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled ||
        false;

    /**
     * Obtient l'élément actuellement en plein écran
     * Compatible avec les préfixes navigateurs
     */
    const obtenirElementPleinEcran = useCallback(() => {
        return (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement ||
            null
        );
    }, []);

    /**
     * Active le mode plein écran
     * Cible l'élément racine du document (documentElement)
     */
    const entrerPleinEcran = useCallback(async () => {
        if (!estSupporte) {
            console.warn("API Fullscreen non supportée sur cet appareil");
            return;
        }

        try {
            const element = document.documentElement;

            // Support multi-navigateurs avec préfixes
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                await element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                await element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                await element.msRequestFullscreen();
            }
        } catch (error) {
            console.error("Erreur activation plein écran:", error);
        }
    }, [estSupporte]);

    /**
     * Désactive le mode plein écran
     */
    const sortirPleinEcran = useCallback(async () => {
        if (!estSupporte) {
            return;
        }

        try {
            // Support multi-navigateurs avec préfixes
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                await document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                await document.msExitFullscreen();
            }
        } catch (error) {
            console.error("Erreur désactivation plein écran:", error);
        }
    }, [estSupporte]);

    /**
     * Bascule entre plein écran et mode normal
     */
    const basculerPleinEcran = useCallback(() => {
        if (estPleinEcran) {
            sortirPleinEcran();
        } else {
            entrerPleinEcran();
        }
    }, [estPleinEcran, entrerPleinEcran, sortirPleinEcran]);

    /**
     * Gère les changements d'état plein écran
     * Synchronise l'état React avec l'état réel du navigateur
     * Appelé lors de : toggle manuel, touche Escape, F11, etc.
     */
    useEffect(() => {
        if (!estSupporte) {
            return;
        }

        const gererChangementPleinEcran = () => {
            const elementPleinEcran = obtenirElementPleinEcran();
            setEstPleinEcran(!!elementPleinEcran);
        };

        // Écouter les événements avec support multi-navigateurs
        document.addEventListener(
            "fullscreenchange",
            gererChangementPleinEcran
        );
        document.addEventListener(
            "webkitfullscreenchange",
            gererChangementPleinEcran
        );
        document.addEventListener(
            "mozfullscreenchange",
            gererChangementPleinEcran
        );
        document.addEventListener(
            "MSFullscreenChange",
            gererChangementPleinEcran
        );

        // Gestion des erreurs
        const gererErreurPleinEcran = (error) => {
            console.error("Erreur plein écran:", error);
            setEstPleinEcran(false);
        };

        document.addEventListener("fullscreenerror", gererErreurPleinEcran);
        document.addEventListener(
            "webkitfullscreenerror",
            gererErreurPleinEcran
        );
        document.addEventListener("mozfullscreenerror", gererErreurPleinEcran);
        document.addEventListener("MSFullscreenError", gererErreurPleinEcran);

        // Cleanup lors du démontage
        return () => {
            document.removeEventListener(
                "fullscreenchange",
                gererChangementPleinEcran
            );
            document.removeEventListener(
                "webkitfullscreenchange",
                gererChangementPleinEcran
            );
            document.removeEventListener(
                "mozfullscreenchange",
                gererChangementPleinEcran
            );
            document.removeEventListener(
                "MSFullscreenChange",
                gererChangementPleinEcran
            );

            document.removeEventListener(
                "fullscreenerror",
                gererErreurPleinEcran
            );
            document.removeEventListener(
                "webkitfullscreenerror",
                gererErreurPleinEcran
            );
            document.removeEventListener(
                "mozfullscreenerror",
                gererErreurPleinEcran
            );
            document.removeEventListener(
                "MSFullscreenError",
                gererErreurPleinEcran
            );
        };
    }, [estSupporte, obtenirElementPleinEcran]);

    return {
        estPleinEcran,
        entrerPleinEcran,
        sortirPleinEcran,
        basculerPleinEcran,
        estSupporte,
    };
}
