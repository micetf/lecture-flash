/**
 * Composant amélioré de choix de vitesse de lecture
 *
 * VERSION 3.0.0 : Solution hybride avec mode personnalisé
 *
 * Améliorations UX :
 * - Niveau 1 : 5 boutons guidés (vitesses Eduscol)
 * - Niveau 2 : Curseur personnalisé (30-110 MLM) pour mode expert
 * - Pré-sélection visuelle si vitesse suggérée (speedConfig)
 * - Bouton "Tester" pour chaque vitesse
 * - Preview visuelle de la vitesse
 * - Recommandations pédagogiques par niveau
 * - Tooltips informatifs sur chaque vitesse
 *
 * @component
 * @param {Object} props
 * @param {Function} props.choisirVitesse - Callback pour choisir la vitesse
 * @param {string} [props.texte] - Texte pour la preview (optionnel)
 * @param {Object} [props.speedConfig] - Config vitesse depuis URL { speed: number, locked: boolean }
 */

import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Tooltip from "../../Tooltip";

/**
 * Configuration des vitesses avec recommandations pédagogiques et tooltips
 * Sources : Eduscol, recherches en fluence (Sprenger-Charolles)
 */
const VITESSES = [
    {
        valeur: 30,
        label: "Très lent",
        color: "blue",
        colorClass: "bg-blue-500 hover:bg-blue-600 border-blue-600",
        niveau: "CP - début CE1",
        description: "Déchiffrage en cours d'acquisition",
        tooltip:
            "30 mots/min - Idéal pour les élèves en début d'apprentissage de la lecture",
    },
    {
        valeur: 50,
        label: "Lent",
        color: "green",
        colorClass: "bg-green-500 hover:bg-green-600 border-green-600",
        niveau: "CE1",
        description: "Lecture mot à mot",
        tooltip: "50 mots/min - Recommandé pour la lecture à voix haute en CE1",
    },
    {
        valeur: 70,
        label: "Moyen",
        color: "yellow",
        colorClass: "bg-yellow-500 hover:bg-yellow-600 border-yellow-600",
        niveau: "CE2",
        description: "Lecture par groupes de mots",
        tooltip:
            "70 mots/min - Adapté aux élèves de CE2 qui lisent par groupes de mots",
    },
    {
        valeur: 90,
        label: "Rapide",
        color: "orange",
        colorClass: "bg-orange-500 hover:bg-orange-600 border-orange-600",
        niveau: "CM1-CM2",
        description: "Lecture fluide",
        tooltip: "90 mots/min - Pour une lecture fluide en CM1-CM2",
    },
    {
        valeur: 110,
        label: "Très rapide",
        color: "red",
        colorClass: "bg-red-500 hover:bg-red-600 border-red-600",
        niveau: "CM2 et +",
        description: "Lecture experte",
        tooltip: "110 mots/min - Niveau de lecture expert, CM2 et collège",
    },
];

/**
 * Texte de démonstration pour la preview
 */
const TEXTE_DEMO = "La lecture fluente permet de mieux comprendre les textes.";

/**
 * Détermine la zone Eduscol correspondant à une vitesse personnalisée
 * @param {number} speed - Vitesse en MLM
 * @returns {string} Zone pédagogique
 */
const getZoneEduscol = (speed) => {
    if (speed <= 40) return "CP - début CE1 (déchiffrage)";
    if (speed <= 60) return "CE1 (lecture mot à mot)";
    if (speed <= 80) return "CE2 (lecture par groupes)";
    if (speed <= 100) return "CM1-CM2 (lecture fluide)";
    return "CM2+ (lecture experte)";
};

function ChoixVitesseAmeliore({ choisirVitesse, texte, speedConfig }) {
    const [vitesseTest, setVitesseTest] = useState(null);
    const [vitesseSelectionnee, setVitesseSelectionnee] = useState(null);
    const [isTestActive, setIsTestActive] = useState(false);
    const timeoutRef = useRef(null);

    // États pour le mode réglage personnalisé
    const [showCustomMode, setShowCustomMode] = useState(false);
    const [customSpeed, setCustomSpeed] = useState(70);

    /**
     * Nettoie le timer au démontage
     */
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    /**
     * Lance un test de vitesse
     * @param {number} vitesse - Vitesse à tester
     */
    const handleTest = (vitesse) => {
        // Arrêter le test en cours avant d'en lancer un nouveau
        handleStopTest();

        setVitesseTest(vitesse);
        setIsTestActive(true);

        // Arrêt automatique après 10 secondes
        timeoutRef.current = setTimeout(() => {
            setIsTestActive(false);
            setVitesseTest(null);
        }, 10000);
    };

    /**
     * Arrête le test en cours
     */
    const handleStopTest = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsTestActive(false);
        setVitesseTest(null);
    };

    /**
     * Valide le choix de vitesse
     * @param {number} vitesse - Vitesse choisie
     */
    const handleSelect = (vitesse) => {
        handleStopTest();
        setVitesseSelectionnee(vitesse);
        choisirVitesse(vitesse);
    };

    /**
     * Composant Preview de vitesse
     */
    const PreviewVitesse = ({ vitesse }) => {
        const [motActuel, setMotActuel] = useState(0);
        const mots = (texte || TEXTE_DEMO).split(" ");
        const intervalMs = 60000 / vitesse; // Approximation

        useEffect(() => {
            if (!isTestActive) return;

            const interval = setInterval(() => {
                setMotActuel((prev) => {
                    if (prev >= mots.length - 1) {
                        return 0; // Boucle
                    }
                    return prev + 1;
                });
            }, intervalMs);

            return () => clearInterval(interval);
        }, [isTestActive, intervalMs, mots.length]);

        if (!isTestActive) return null;

        return (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg border-2 border-blue-400">
                <p className="text-lg leading-relaxed">
                    {mots.map((mot, index) => (
                        <span
                            key={index}
                            className={`${
                                index === motActuel
                                    ? "bg-yellow-300 font-bold"
                                    : index < motActuel
                                      ? "text-gray-400"
                                      : "text-gray-800"
                            }`}
                        >
                            {mot}{" "}
                        </span>
                    ))}
                </p>
            </div>
        );
    };

    return (
        <div className="w-full">
            {/* Preview de vitesse (globale) */}
            {isTestActive && <PreviewVitesse vitesse={vitesseTest} />}

            {/* Message d'aide */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">
                    💡 Testez chaque vitesse avant de faire votre choix
                </p>
            </div>

            {/* Grille des 5 vitesses officielles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {VITESSES.map((v) => {
                    const isSuggested = speedConfig?.speed === v.valeur;

                    return (
                        <div
                            key={v.valeur}
                            className={`border-2 rounded-lg p-4 transition-all ${
                                isSuggested
                                    ? "border-yellow-400 bg-yellow-50 shadow-lg ring-2 ring-yellow-300"
                                    : "border-gray-300 bg-white"
                            }`}
                        >
                            {/* Badge "vitesse suggérée" */}
                            {isSuggested && (
                                <div className="text-center mb-2">
                                    <span className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 font-semibold text-xs rounded-full">
                                        ⭐ Vitesse suggérée
                                    </span>
                                </div>
                            )}

                            {/* En-tête avec tooltip */}
                            <Tooltip content={v.tooltip} position="top">
                                <div className="text-center mb-3 cursor-help">
                                    <div
                                        className={`inline-block px-4 py-2 ${v.colorClass} text-white rounded-full font-bold text-lg mb-2`}
                                    >
                                        {v.valeur} MLM
                                    </div>
                                    <p className="text-sm font-semibold text-gray-700">
                                        {v.label}
                                    </p>
                                </div>
                            </Tooltip>

                            {/* Informations pédagogiques */}
                            <div className="text-center mb-3 text-sm text-gray-600">
                                <p className="font-medium">{v.niveau}</p>
                                <p className="text-xs italic">
                                    {v.description}
                                </p>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleTest(v.valeur)}
                                    disabled={
                                        isTestActive && vitesseTest !== v.valeur
                                    }
                                    className="flex-1 px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                                >
                                    {isTestActive && vitesseTest === v.valeur
                                        ? "⏸ Arrêter"
                                        : "🧪 Tester"}
                                </button>
                                <button
                                    onClick={() => handleSelect(v.valeur)}
                                    className={`flex-1 px-3 py-2 text-white text-sm rounded transition font-semibold ${v.colorClass}`}
                                >
                                    ✓ Choisir
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Message d'aide */}
            <div className="text-center text-sm text-gray-600 mb-6">
                <p>
                    👆 Survolez une vitesse pour plus d'informations, testez-la,
                    puis cliquez sur "Choisir"
                </p>
            </div>

            {/* Lien vers mode personnalisé (masqué si élève avec speedConfig) */}
            {!speedConfig && !showCustomMode && (
                <div className="text-center mt-6 border-t pt-6">
                    <button
                        onClick={() => setShowCustomMode(true)}
                        className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                        ⚙️ Réglage personnalisé (mode expert)
                    </button>
                </div>
            )}

            {/* Mode réglage personnalisé (curseur) */}
            {showCustomMode && (
                <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-blue-400 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-800 text-lg">
                            ⚙️ Réglage personnalisé : {customSpeed} MLM
                        </h4>
                        <button
                            onClick={() => setShowCustomMode(false)}
                            className="text-sm text-gray-600 hover:text-gray-800 font-bold px-3 py-1 rounded hover:bg-gray-200 transition"
                        >
                            ✕ Fermer
                        </button>
                    </div>

                    {/* Curseur */}
                    <div className="mb-4">
                        <input
                            type="range"
                            min="30"
                            max="110"
                            step="5"
                            value={customSpeed}
                            onChange={(e) =>
                                setCustomSpeed(parseInt(e.target.value, 10))
                            }
                            className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, 
                  rgb(147, 197, 253) 0%, 
                  rgb(250, 204, 21) 50%, 
                  rgb(252, 165, 165) 100%)`,
                            }}
                        />

                        {/* Graduations des 5 paliers officiels */}
                        <div className="flex justify-between text-xs text-gray-600 mt-2 px-1">
                            <span className="font-semibold">30</span>
                            <span className="font-semibold">50</span>
                            <span className="font-semibold">70</span>
                            <span className="font-semibold">90</span>
                            <span className="font-semibold">110</span>
                        </div>
                    </div>

                    {/* Affichage de la zone Eduscol */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm mb-4">
                        <p className="font-medium text-blue-800 mb-2">
                            📍 Zone pédagogique : {getZoneEduscol(customSpeed)}
                        </p>
                        <p className="text-gray-700 text-xs">
                            💡 Les vitesses officielles (30-50-70-90-110)
                            correspondent aux repères Eduscol pour les cycles 2
                            et 3
                        </p>
                    </div>

                    {/* Boutons test et validation */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleTest(customSpeed)}
                            disabled={
                                isTestActive && vitesseTest !== customSpeed
                            }
                            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                        >
                            {isTestActive && vitesseTest === customSpeed
                                ? "⏸ Test en cours..."
                                : `🧪 Tester ${customSpeed} MLM`}
                        </button>
                        <button
                            onClick={() => handleSelect(customSpeed)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            ✓ Choisir {customSpeed} MLM
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

ChoixVitesseAmeliore.propTypes = {
    choisirVitesse: PropTypes.func.isRequired,
    texte: PropTypes.string,
    speedConfig: PropTypes.shape({
        speed: PropTypes.number,
        locked: PropTypes.bool,
    }),
};

export default ChoixVitesseAmeliore;
