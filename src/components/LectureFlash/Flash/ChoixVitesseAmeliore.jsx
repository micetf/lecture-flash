/**
 * Composant amélioré de choix de vitesse de lecture
 *
 * Améliorations UX :
 * - Bouton "Tester" pour chaque vitesse
 * - Preview visuelle de la vitesse
 * - Recommandations pédagogiques par niveau
 * - Design plus intuitif avec codes couleur
 *
 * @component
 * @param {Object} props
 * @param {Function} props.choisirVitesse - Callback pour choisir la vitesse
 * @param {string} [props.texte] - Texte pour la preview (optionnel)
 */

import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Configuration des vitesses avec recommandations pédagogiques
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
    },
    {
        valeur: 50,
        label: "Lent",
        color: "green",
        colorClass: "bg-green-500 hover:bg-green-600 border-green-600",
        niveau: "CE1",
        description: "Lecture mot à mot",
    },
    {
        valeur: 70,
        label: "Moyen",
        color: "yellow",
        colorClass: "bg-yellow-500 hover:bg-yellow-600 border-yellow-600",
        niveau: "CE2",
        description: "Lecture par groupes de mots",
    },
    {
        valeur: 90,
        label: "Rapide",
        color: "orange",
        colorClass: "bg-orange-500 hover:bg-orange-600 border-orange-600",
        niveau: "CM1-CM2",
        description: "Lecture fluide",
    },
    {
        valeur: 110,
        label: "Très rapide",
        color: "red",
        colorClass: "bg-red-500 hover:bg-red-600 border-red-600",
        niveau: "CM2 et +",
        description: "Lecture experte",
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
        }, 3000);
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
        const intervalMs = 60000 / vitesse / 5; // Approximation

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
                            {/* Informations de la vitesse */}
                            <div className="flex-1">
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

                            {/* Boutons d'action */}
                            <div className="flex gap-2">
                                {vitesseTest === v.valeur && isTestActive ? (
                                    <button
                                        onClick={handleStopTest}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition text-sm"
                                        title="Arrêter le test"
                                    >
                                        ⏹ Arrêter
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleTest(v.valeur)}
                                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition text-sm"
                                        title="Tester cette vitesse pendant 3 secondes"
                                    >
                                        👁️ Tester
                                    </button>
                                )}

                                <button
                                    onClick={() => handleSelect(v.valeur)}
                                    className={`px-6 py-2 rounded-lg font-semibold transition text-sm ${
                                        vitesseSelectionnee === v.valeur
                                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                                            : `${v.colorClass} text-white`
                                    }`}
                                    title={`Choisir ${v.valeur} mots par minute`}
                                >
                                    {vitesseSelectionnee === v.valeur
                                        ? "✓ Sélectionné"
                                        : "Choisir"}
                                </button>
                            </div>
                        </div>

                        {/* Preview pendant le test */}
                        {vitesseTest === v.valeur && (
                            <PreviewVitesse vitesse={v.valeur} />
                        )}
                    </div>
                ))}
            </div>

            {/* Aide pédagogique */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 text-sm mb-2">
                    ℹ️ Recommandations pédagogiques
                </h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>
                        <strong>Commencez lent</strong> : Mieux vaut une vitesse
                        trop lente qu'une vitesse frustrante
                    </li>
                    <li>
                        <strong>Testez avant de choisir</strong> : La preview
                        vous aide à trouver le bon rythme
                    </li>
                    <li>
                        <strong>Augmentez progressivement</strong> : La fluence
                        se travaille sur la durée
                    </li>
                    <li>
                        <strong>Adaptez au texte</strong> : Un texte complexe
                        nécessite une vitesse plus lente
                    </li>
                </ul>
            </div>

            {/* Légende MLM */}
            <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                    MLM = Mots Lus par Minute • Référence : Fluence au primaire
                    (Eduscol)
                </p>
            </div>
        </div>
    );
}

ChoixVitesseAmeliore.propTypes = {
    choisirVitesse: PropTypes.func.isRequired,
    texte: PropTypes.string,
};

ChoixVitesseAmeliore.defaultProps = {
    texte: TEXTE_DEMO,
};

export default ChoixVitesseAmeliore;
