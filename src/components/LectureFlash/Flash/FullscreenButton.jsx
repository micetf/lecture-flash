/**
 * Composant bouton plein écran
 *
 * Fonctionnalités :
 * - Toggle mode plein écran via API Fullscreen native
 * - Icône dynamique : ⛶ (entrer) / ⛿ (quitter)
 * - Détection support API navigateur
 * - Fallback gracieux si API non supportée (Safari iOS)
 * - Tooltip explicatif
 * - Accessibilité complète (ARIA, clavier)
 *
 * Conformité :
 * - Principe charge cognitive minimale (Tricot)
 * - Immersion renforcée pendant exercice
 * - Adapté TBI/TNI pour projection
 *
 * @component
 *
 * @example
 * <FullscreenButton />
 */

import React from "react";
import useFullscreen from "@hooks/useFullscreen";
import Tooltip from "../../Tooltip";

/**
 * Composant bouton toggle plein écran
 */
function FullscreenButton() {
    const { estPleinEcran, basculerPleinEcran, estSupporte } = useFullscreen();

    // Si l'API n'est pas supportée, ne pas afficher le bouton
    // (Alternative : afficher désactivé avec tooltip explicatif)
    if (!estSupporte) {
        return (
            <Tooltip
                content="Plein écran non disponible sur cet appareil"
                position="top"
            >
                <button
                    disabled
                    className="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed opacity-50"
                    aria-label="Plein écran non disponible"
                >
                    <span className="text-xl">⛶</span>
                    <span className="ml-2 text-sm">Plein écran</span>
                </button>
            </Tooltip>
        );
    }

    return (
        <Tooltip
            content={
                estPleinEcran
                    ? "Quitter le mode plein écran (ou appuyez sur Échap)"
                    : "Activer le mode plein écran pour une meilleure concentration"
            }
            position="top"
        >
            <button
                onClick={basculerPleinEcran}
                className={`
                    px-4 py-2 rounded-lg font-medium transition-all
                    ${
                        estPleinEcran
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-2 border-yellow-400"
                            : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300"
                    }
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                `}
                aria-label={
                    estPleinEcran
                        ? "Quitter le plein écran"
                        : "Activer le plein écran"
                }
                aria-pressed={estPleinEcran}
            >
                {/* Icône dynamique */}
                <span className="text-xl" aria-hidden="true">
                    {estPleinEcran ? "⛿" : "⛶"}
                </span>

                {/* Label */}
                <span className="ml-2 text-sm">
                    {estPleinEcran ? "Quitter" : "Plein écran"}
                </span>
            </button>
        </Tooltip>
    );
}

export default FullscreenButton;
