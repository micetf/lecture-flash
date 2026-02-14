/**
 * Composant d'options d'affichage (police et taille)
 * VERSION 3.10.1 : Synchronisation avec options URL
 *
 * Corrections v3.10.1 :
 * - 🔧 AJOUT : Prop initialOptions pour synchronisation avec URL
 * - 🔧 AJOUT : Effet pour appliquer initialOptions au montage
 *
 * Corrections v3.9.14 (Sprint 18 BIS) :
 * - 🔧 REFACTORING : Import OPTIONS_POLICE depuis @config/constants
 *   - Élimination définition locale dupliquée
 *   - Source unique de vérité
 * - 🔧 REFACTORING : Utilisation helper getTextStyles()
 *   - Calcul styles centralisé dans @utils/textStyles
 *   - Cohérence garantie avec TextAnimation
 *
 * Corrections v3.9.13 (Sprint 18) :
 * - Formule fontSize aperçu = formule réelle TextAnimation
 * - Cohérence : 100% = 3rem (48px) dans aperçu ET lecture
 *
 * Fonctionnalités :
 * - Section optionnelle collapsed par défaut (préserve simplicité)
 * - Sélecteur police : Défaut, OpenDyslexic, Arial, Comic Sans MS
 * - Curseur taille : 100-200% (pas de 10%)
 * - Affichage valeur courante en temps réel
 * - Persistance localStorage via hook useLocalStorage
 * - Synchronisation avec options URL (élèves)
 * - Tooltip explicatif au survol
 *
 * Conformité :
 * - Accessibilité WCAG 2.1 AA (critère 1.4.4)
 * - Adapté TBI/TNI et élèves à besoins particuliers
 * - Charge cognitive minimale (collapsed par défaut)
 *
 * @component
 *
 * @example
 * <DisplayOptions
 *   onOptionsChange={(options) => console.log(options)}
 *   initialOptions={{ police: 'opendyslexic', taille: 150 }}
 * />
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useLocalStorage from "@hooks/useLocalStorage";
import Tooltip from "../../Tooltip";
import { OPTIONS_POLICE } from "@config/constants";
import { getTextStyles } from "@config/textStyles";

/**
 * Valeurs par défaut des options
 */
const OPTIONS_PAR_DEFAUT = {
    police: "default",
    taille: 100, // Pourcentage (100 = 100%)
};

/**
 * Composant d'options d'affichage
 *
 * @param {Object} props
 * @param {Function} props.onOptionsChange - Callback appelé lors changement options
 * @param {Object} props.initialOptions - Options initiales (ex: depuis URL)
 */
function DisplayOptions({ onOptionsChange, initialOptions }) {
    // État collapsed/expanded
    const [estExpanded, setEstExpanded] = useState(false);

    // Persistance options dans localStorage
    const [options, setOptions] = useLocalStorage(
        "lecture-flash-font-settings",
        initialOptions || OPTIONS_PAR_DEFAUT
    );

    /**
     * Synchronisation avec initialOptions (ex: chargement depuis URL)
     * Permet d'appliquer les options de l'enseignant quand l'élève charge un lien
     */
    useEffect(() => {
        if (
            initialOptions &&
            (initialOptions.police !== options.police ||
                initialOptions.taille !== options.taille)
        ) {
            setOptions(initialOptions);
        }
    }, [initialOptions]);

    /**
     * Notifie le parent des changements d'options
     */
    useEffect(() => {
        onOptionsChange(options);
    }, [options, onOptionsChange]);

    /**
     * Gère le changement de police
     */
    const handlePoliceChange = (event) => {
        setOptions({
            ...options,
            police: event.target.value,
        });
    };

    /**
     * Gère le changement de taille
     */
    const handleTailleChange = (event) => {
        setOptions({
            ...options,
            taille: parseInt(event.target.value, 10),
        });
    };

    /**
     * Bascule l'état collapsed/expanded
     */
    const toggleExpanded = () => {
        setEstExpanded(!estExpanded);
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* En-tête avec tooltip */}
            <button
                onClick={toggleExpanded}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                aria-expanded={estExpanded}
                aria-controls="display-options-content"
            >
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                        ⚙️ Options d'affichage
                    </span>

                    {/* Tooltip explicatif */}
                    <Tooltip
                        content="Pour adapter au TBI ou élèves à besoins particuliers"
                        position="right"
                    >
                        <span className="text-gray-400 hover:text-gray-600 cursor-help">
                            ℹ️
                        </span>
                    </Tooltip>
                </div>

                {/* Icône expand/collapse */}
                <svg
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                        estExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Contenu collapsed */}
            {estExpanded && (
                <div
                    id="display-options-content"
                    className="p-4 space-y-6 bg-white"
                >
                    {/* Sélecteur de police */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Police de caractères
                        </label>
                        <div className="space-y-2">
                            {OPTIONS_POLICE.map((optionPolice) => (
                                <label
                                    key={optionPolice.value}
                                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="police"
                                        value={optionPolice.value}
                                        checked={
                                            options.police ===
                                            optionPolice.value
                                        }
                                        onChange={handlePoliceChange}
                                        className="w-4 h-4 text-primary-600 focus:ring-2 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        {optionPolice.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Curseur de taille */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">
                                Taille du texte
                            </label>
                            <span className="text-2xl font-bold text-primary-600">
                                {options.taille}%
                            </span>
                        </div>

                        {/* Input range */}
                        <input
                            type="range"
                            min="100"
                            max="200"
                            step="10"
                            value={options.taille}
                            onChange={handleTailleChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            aria-label="Taille du texte en pourcentage"
                            aria-valuemin="100"
                            aria-valuemax="200"
                            aria-valuenow={options.taille}
                        />

                        {/* Indicateurs min/max */}
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>100%</span>
                            <span>200%</span>
                        </div>
                    </div>

                    {/* Aperçu en temps réel */}
                    <div className="mt-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                        <p className="text-xs text-gray-600 mb-2 font-medium">
                            📋 Aperçu :
                        </p>
                        <p
                            className="text-center leading-relaxed"
                            style={getTextStyles(
                                options.police,
                                options.taille
                            )}
                        >
                            Le texte s'affichera avec cette police et cette
                            taille pendant la lecture.
                        </p>
                    </div>
                    {/* Message informatif */}
                    <p className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded p-3">
                        💡 Ces paramètres seront appliqués lors de la lecture et
                        sauvegardés automatiquement.
                    </p>
                </div>
            )}
        </div>
    );
}

DisplayOptions.propTypes = {
    /** Callback appelé lors changement options {police, taille} */
    onOptionsChange: PropTypes.func.isRequired,
    /** Options initiales (ex: depuis URL partagée par l'enseignant) */
    initialOptions: PropTypes.shape({
        police: PropTypes.string,
        taille: PropTypes.number,
    }),
};

export default DisplayOptions;
