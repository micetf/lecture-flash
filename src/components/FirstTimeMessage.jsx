/**
 * Composant de message de première utilisation
 * S'affiche une seule fois lors de la première visite, puis disparaît définitivement
 *
 * Fonctionnalités :
 * - Détection première visite via localStorage
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

/**
 * Clé localStorage pour stocker l'état de première visite
 */
const STORAGE_KEY = "lecture-flash-first-visit";

function FirstTimeMessage() {
    const [isVisible, setIsVisible] = useState(false);

    /**
     * Vérifie au montage si l'utilisateur a déjà vu le message
     */
    useEffect(() => {
        const hasSeenMessage = localStorage.getItem(STORAGE_KEY);

        if (!hasSeenMessage) {
            // Petit délai pour que l'animation soit perceptible
            setTimeout(() => {
                setIsVisible(true);
            }, 300);
        }
    }, []);

    /**
     * Gère la fermeture du message et sauvegarde la préférence
     */
    const handleDismiss = () => {
        localStorage.setItem(STORAGE_KEY, "true");
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

                    {/* Instructions simplifiées */}
                    <ol className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start">
                            <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full mr-2 font-semibold flex-shrink-0">
                                1
                            </span>
                            <span>
                                Ajoutez votre texte (saisie, fichier, ou cloud)
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full mr-2 font-semibold flex-shrink-0">
                                2
                            </span>
                            <span>
                                Choisissez une vitesse adaptée à votre niveau
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full mr-2 font-semibold flex-shrink-0">
                                3
                            </span>
                            <span>
                                Lancez la lecture et suivez le texte qui
                                disparaît !
                            </span>
                        </li>
                    </ol>

                    {/* Bouton de fermeture définitive */}
                    <button
                        onClick={handleDismiss}
                        className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium underline transition"
                    >
                        Ne plus afficher ce message
                    </button>
                </div>

                {/* Bouton de fermeture (×) */}
                <button
                    onClick={handleDismiss}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none flex-shrink-0 transition"
                    aria-label="Fermer le message de bienvenue"
                    title="Fermer"
                >
                    ×
                </button>
            </div>
        </div>
    );
}

export default FirstTimeMessage;
