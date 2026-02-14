/**
 * Composant de message de première utilisation
 * S'affiche une seule fois lors de la première visite, puis disparaît définitivement
 *
 * Fonctionnalités :
 * - Détection première visite via localStorage (hook useLocalStorage)
 * - Bannière de bienvenue avec instructions simplifiées
 * - Bouton de fermeture avec sauvegarde de la préférence
 * - Animation d'apparition progressive
 *
 * Conformité :
 * - RGPD : stockage local uniquement (pas de tracking)
 * - Accessibilité : ARIA labels, navigation clavier
 *
 * @component
 *
 * @example
 * <FirstTimeMessage />
 */

import React, { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

function FirstTimeMessage() {
    const [isVisible, setIsVisible] = useState(false);

    // Utilisation du hook useLocalStorage au lieu de localStorage direct
    const [hasSeenMessage, setHasSeenMessage] = useLocalStorage(
        "lecture-flash-first-visit",
        false
    );

    /**
     * Vérifie au montage si l'utilisateur a déjà vu le message
     */
    useEffect(() => {
        if (!hasSeenMessage) {
            // Petit délai pour que l'animation soit perceptible
            setTimeout(() => {
                setIsVisible(true);
            }, 300);
        }
    }, [hasSeenMessage]);

    /**
     * Gère la fermeture du message et sauvegarde la préférence
     */
    const handleDismiss = () => {
        setHasSeenMessage(true);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 shadow-sm animate-fade-in">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    {/* En-tête avec emoji */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="text-2xl mr-3" aria-hidden="true">
                            👋
                        </span>
                        Bienvenue sur Lecture Flash !
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 mb-4">
                        Cet outil vous aide à améliorer la{" "}
                        <strong>fluence de lecture</strong> grâce à la technique
                        du texte qui s'efface progressivement.
                    </p>

                    {/* Liste d'étapes */}
                    <ol className="space-y-2 text-sm text-gray-600 mb-4">
                        <li className="flex items-start">
                            <span className="font-bold text-primary-600 mr-2">
                                1.
                            </span>
                            <span>
                                <strong>Saisissez ou chargez un texte</strong>{" "}
                                (onglets disponibles)
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold text-primary-600 mr-2">
                                2.
                            </span>
                            <span>
                                <strong>Choisissez une vitesse</strong> adaptée
                                au niveau de lecture
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold text-primary-600 mr-2">
                                3.
                            </span>
                            <span>
                                <strong>Lancez la lecture</strong> et observez
                                le texte s'effacer progressivement
                            </span>
                        </li>
                    </ol>

                    {/* Astuce aide */}
                    <p className="text-xs text-gray-500">
                        💡 Besoin d'aide ? Cliquez sur le bouton{" "}
                        <span className="font-bold">?</span> en haut à droite
                    </p>
                </div>

                {/* Bouton fermeture */}
                <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Fermer le message de bienvenue"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default FirstTimeMessage;
