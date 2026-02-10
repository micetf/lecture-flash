/**
 * Composant amélioré de choix de vitesse de lecture
 *
 * VERSION AVEC TOOLTIPS : Ajout de tooltips contextuels sur chaque vitesse
 *
 * Améliorations UX :
 * - Bouton "Tester" pour chaque vitesse
 * - Preview visuelle de la vitesse
 * - Recommandations pédagogiques par niveau
 * - Tooltips informatifs sur chaque vitesse
 * - Design plus intuitif avec codes couleur
 *
 * @component
 * @param {Object} props
 * @param {Function} props.choisirVitesse - Callback pour choisir la vitesse
 * @param {string} [props.texte] - Texte pour la preview (optionnel)
 */

import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Tooltip from "../../Tooltip"; // ← Chemin relatif depuis Flash/ vers components/Tooltip/

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

function ChoixVitesseAmeliore({ choisirVitesse, texte }) {
    const [vitesseTest, setVitesseTest] = useState(null);
    const [vitesseSelectionnee, setVitesseSelectionnee] = useState(null);
    const [isTestActive, setIsTestActive] = useState(false);
    const timeoutRef = useRef(null);

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
        setVitesseTest(vitesse);
        setIsTestActive(true);

        // Arrêt automatique après 3 secondes
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setIsTestActive(false);
            setVitesseTest(null);
        }, 60000);
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
            <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-lg leading-relaxed">
                    {mots.map((mot, index) => (
                        <span
                            key={index}
                            className={`inline-block mr-1 transition-all duration-100 ${
                                index === motActuel
                                    ? "font-bold text-blue-600 scale-110"
                                    : index < motActuel
                                      ? "text-gray-400"
                                      : "text-gray-700"
                            }`}
                        >
                            {mot}
                        </span>
                    ))}
                </p>
            </div>
        );
    };

    PreviewVitesse.propTypes = {
        vitesse: PropTypes.number.isRequired,
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Choisissez votre vitesse de lecture
            </h3>
            <p className="text-sm text-gray-600 mb-4">
                💡 Testez chaque vitesse avant de faire votre choix
            </p>

            <div className="space-y-3">
                {VITESSES.map((v) => (
                    <div
                        key={v.valeur}
                        className={`border-2 rounded-lg p-4 transition-all ${
                            vitesseSelectionnee === v.valeur
                                ? "border-blue-500 bg-blue-50"
                                : vitesseTest === v.valeur
                                  ? "border-yellow-400 bg-yellow-50"
                                  : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                        <div className="flex items-center justify-between gap-4">
                            {/* Informations de la vitesse avec tooltip */}
                            <Tooltip content={v.tooltip} position="right">
                                <div className="flex-1 cursor-help">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-white font-bold text-sm ${v.colorClass.split(" ")[0]}`}
                                        >
                                            {v.valeur} MLM
                                        </span>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                {v.label}
                                            </h4>
                                            <p className="text-xs text-gray-600">
                                                {v.niveau} • {v.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Tooltip>

                            {/* Boutons d'action */}
                            <div className="flex gap-2">
                                {vitesseTest === v.valeur && isTestActive ? (
                                    <button
                                        onClick={handleStopTest}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium text-sm"
                                    >
                                        ⏹️ Arrêter
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleTest(v.valeur)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                                        disabled={isTestActive}
                                    >
                                        ▶️ Tester
                                    </button>
                                )}

                                <button
                                    onClick={() => handleSelect(v.valeur)}
                                    className={`px-4 py-2 rounded-lg transition font-medium text-sm ${
                                        vitesseSelectionnee === v.valeur
                                            ? "bg-blue-600 text-white"
                                            : `${v.colorClass} text-white`
                                    }`}
                                    disabled={isTestActive}
                                >
                                    {vitesseSelectionnee === v.valeur
                                        ? "✓ Sélectionné"
                                        : "Choisir"}
                                </button>
                            </div>
                        </div>

                        {/* Preview de la vitesse si test en cours */}
                        {vitesseTest === v.valeur && (
                            <PreviewVitesse vitesse={v.valeur} />
                        )}
                    </div>
                ))}
            </div>

            {/* Message si aucune vitesse sélectionnée */}
            {!vitesseSelectionnee && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                        👆 Survolez une vitesse pour plus d'informations,
                        testez-la, puis cliquez sur "Choisir"
                    </p>
                </div>
            )}
        </div>
    );
}

ChoixVitesseAmeliore.propTypes = {
    choisirVitesse: PropTypes.func.isRequired,
    texte: PropTypes.string,
};

export default ChoixVitesseAmeliore;
