/**
 * Enhanced reading speed selection component
 *
 * VERSION 3.1.0 : Visual UX improvements
 *
 * @component
 */

import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Tooltip from "../../Tooltip";
import Word from "./Word";

const SPEEDS = [
    {
        value: 30,
        label: "Très lent",
        color: "blue",
        colorClass: "bg-blue-500 hover:bg-blue-600 border-blue-600",
        level: "CP - début CE1",
        description: "Déchiffrage en cours d'acquisition",
        tooltip:
            "30 mots/min - Idéal pour les élèves en début d'apprentissage de la lecture",
    },
    {
        value: 50,
        label: "Lent",
        color: "green",
        colorClass: "bg-green-500 hover:bg-green-600 border-green-600",
        level: "CE1",
        description: "Lecture mot à mot",
        tooltip: "50 mots/min - Recommandé pour la lecture à voix haute en CE1",
    },
    {
        value: 70,
        label: "Moyen",
        color: "yellow",
        colorClass: "bg-yellow-500 hover:bg-yellow-600 border-yellow-600",
        level: "CE2",
        description: "Lecture par groupes de mots",
        tooltip:
            "70 mots/min - Adapté aux élèves de CE2 qui lisent par groupes de mots",
    },
    {
        value: 90,
        label: "Rapide",
        color: "orange",
        colorClass: "bg-orange-500 hover:bg-orange-600 border-orange-600",
        level: "CM1-CM2",
        description: "Lecture fluide",
        tooltip: "90 mots/min - Pour une lecture fluide en CM1-CM2",
    },
    {
        value: 110,
        label: "Très rapide",
        color: "red",
        colorClass: "bg-red-500 hover:bg-red-600 border-red-600",
        level: "CM2 et +",
        description: "Lecture experte",
        tooltip: "110 mots/min - Niveau de lecture expert, CM2 et collège",
    },
];

const DEMO_TEXT = "La lecture fluente permet de mieux comprendre les textes.";

const getEduscolZone = (speed) => {
    if (speed <= 40) return "CP - début CE1 (déchiffrage)";
    if (speed <= 60) return "CE1 (lecture mot à mot)";
    if (speed <= 80) return "CE2 (lecture par groupes)";
    if (speed <= 100) return "CM1-CM2 (lecture fluide)";
    return "CM2+ (lecture experte)";
};

function SpeedSelector({ onSpeedChange, text, speedConfig }) {
    const [testSpeed, setTestSpeed] = useState(null);
    const [selectedSpeed, setSelectedSpeed] = useState(null);
    const [isTestActive, setIsTestActive] = useState(false);
    const timeoutRef = useRef(null);
    const [showCustomMode, setShowCustomMode] = useState(false);
    const [customSpeed, setCustomSpeed] = useState(70);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleTest = (speed) => {
        handleStopTest();
        setTestSpeed(speed);
        setIsTestActive(true);

        timeoutRef.current = setTimeout(() => {
            setIsTestActive(false);
            setTestSpeed(null);
        }, 10000);
    };

    const handleStopTest = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsTestActive(false);
        setTestSpeed(null);
    };

    const handleSelect = (speed) => {
        handleStopTest();
        setSelectedSpeed(speed);
        onSpeedChange(speed);
    };

    // Speed preview component with animation
    const SpeedPreview = ({ speed, previewText }) => {
        const [previewWordIndex, setPreviewWordIndex] = useState(0);
        const previewTimerRef = useRef(null);

        // EXACTLY the same constants as TextAnimation
        const NON_BREAKING_SPACE = "\u00a0";
        const NON_BREAKING_HYPHEN = "\u2011";
        const specialsBeforeIn = /(^-|«|') +/g;
        const specialsAfterIn = / +(;|:|!|\?|»|')/g;
        const specialsBeforeOut = /(^-|«)/g;
        const specialsAfterOut = /(;|:|!|\?|»)/g;

        const purifiedText = (previewText || DEMO_TEXT)
            .trim()
            .replace(/'/g, "'")
            .replace(/ +/g, " ")
            .replace(/\n+/g, " ")
            .replace(specialsAfterIn, "$1")
            .replace(specialsBeforeIn, "$1");

        const words = purifiedText.split(" ");
        const wordsCount = words.length;
        const charsCount = purifiedText.length;

        // EXACTLY the same calculation
        const wordSpeed = Math.floor(
            ((wordsCount / speed) * 60000) / charsCount
        );

        useEffect(() => {
            return () => {
                if (previewTimerRef.current) {
                    clearTimeout(previewTimerRef.current);
                }
            };
        }, []);

        const goToNextPreviewWord = () => {
            if (previewWordIndex < wordsCount - 1) {
                setPreviewWordIndex((prev) => prev + 1);
            } else {
                previewTimerRef.current = setTimeout(() => {
                    setPreviewWordIndex(0);
                }, 1500);
            }
        };

        return (
            <div className="mt-4 p-6 bg-blue-50 border-2 border-blue-400 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-blue-800">
                        🧪 Aperçu à {speed} MLM
                    </p>
                    <button
                        onClick={handleStopTest}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                    >
                        ⏸ Arrêter
                    </button>
                </div>

                {/* EXACT same structure as TextAnimation */}
                <div className="bg-white rounded-lg p-4 border border-gray-300">
                    <p className="texte text-xl leading-relaxed">
                        {words.map((word, index) => {
                            const cleanWord = word
                                .replace(
                                    specialsAfterOut,
                                    `${NON_BREAKING_SPACE}$1`
                                )
                                .replace(
                                    specialsBeforeOut,
                                    `$1${NON_BREAKING_SPACE}`
                                )
                                .replace(/-/g, NON_BREAKING_HYPHEN);

                            // Completed words: EXACTLY like TextAnimation
                            if (index < previewWordIndex) {
                                return (
                                    <span key={index} className="mot">
                                        <span style={{ visibility: "hidden" }}>
                                            {cleanWord}
                                        </span>
                                        <span> </span>
                                    </span>
                                );
                            }

                            // Current and future words: EXACTLY like TextAnimation
                            const currentWordSpeed =
                                index === previewWordIndex ? wordSpeed : 0;

                            return (
                                <Word
                                    key={index}
                                    word={cleanWord}
                                    speed={currentWordSpeed}
                                    onNext={
                                        index === previewWordIndex
                                            ? goToNextPreviewWord
                                            : () => {}
                                    }
                                />
                            );
                        })}
                    </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-600">
                        Mot {previewWordIndex + 1} / {wordsCount}
                    </p>
                    <p className="text-xs text-blue-700 font-medium">
                        {speed} mots/minute
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div>
            {/* Suggested speed message if speedConfig present */}
            {speedConfig && !speedConfig.locked && (
                <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                    <p className="text-yellow-900 font-semibold">
                        ⭐ Vitesse recommandée : {speedConfig.speed} MLM
                    </p>
                    <p className="text-sm text-yellow-800 mt-1">
                        💡 Votre enseignant suggère cette vitesse, mais vous
                        pouvez en choisir une autre si nécessaire.
                    </p>
                </div>
            )}

            {/* Preview zone when test is active */}
            {isTestActive && testSpeed && (
                <SpeedPreview speed={testSpeed} previewText={text} />
            )}

            {/* Grid of 5 speeds */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                {SPEEDS.map((speedOption) => {
                    const isSuggested =
                        speedConfig?.speed === speedOption.value;
                    const isSelected = selectedSpeed === speedOption.value;
                    const isTesting =
                        testSpeed === speedOption.value && isTestActive;

                    return (
                        <Tooltip
                            key={speedOption.value}
                            content={speedOption.tooltip}
                            position="top"
                        >
                            <div
                                className={`
                                    rounded-xl p-4 transition-all duration-300 cursor-pointer
                                    ${
                                        isTesting &&
                                        "border-4 border-blue-500 shadow-2xl ring-4 ring-blue-300 animate-pulse"
                                    }
                                    ${
                                        isSelected &&
                                        !isTesting &&
                                        "border-4 border-green-600 shadow-2xl ring-4 ring-green-300"
                                    }
                                    ${
                                        isSuggested &&
                                        !isSelected &&
                                        !isTesting &&
                                        "border-4 border-yellow-400 bg-yellow-50 shadow-lg ring-2 ring-yellow-300"
                                    }
                                    ${
                                        !isSelected &&
                                        !isSuggested &&
                                        !isTesting &&
                                        "border-2 border-gray-300 bg-white hover:shadow-lg hover:border-gray-400"
                                    }
                                `}
                            >
                                {/* Status badge */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        {isSuggested && !isSelected && (
                                            <span className="inline-block px-2 py-0.5 bg-yellow-400 text-yellow-900 font-bold text-xs rounded-full mb-2">
                                                ⭐ Suggérée
                                            </span>
                                        )}
                                        {isSelected && (
                                            <span className="inline-block px-2 py-0.5 bg-green-600 text-white font-bold text-xs rounded-full mb-2">
                                                ✓ Sélectionnée
                                            </span>
                                        )}
                                        {isTesting && (
                                            <span className="inline-block px-2 py-0.5 bg-blue-600 text-white font-bold text-xs rounded-full mb-2 animate-pulse">
                                                🧪 Test en cours
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Speed and label */}
                                <div className="text-center mb-3">
                                    <div
                                        className={`text-4xl font-bold ${
                                            speedOption.color === "blue"
                                                ? "text-blue-600"
                                                : speedOption.color === "green"
                                                  ? "text-green-600"
                                                  : speedOption.color ===
                                                      "yellow"
                                                    ? "text-yellow-600"
                                                    : speedOption.color ===
                                                        "orange"
                                                      ? "text-orange-600"
                                                      : "text-red-600"
                                        }`}
                                    >
                                        {speedOption.value}
                                    </div>
                                    <div className="text-xs text-gray-500 font-medium">
                                        MLM
                                    </div>
                                    <div className="text-sm font-semibold text-gray-700 mt-1">
                                        {speedOption.label}
                                    </div>
                                </div>

                                {/* Level and description */}
                                <div className="text-center mb-4">
                                    <div className="text-xs font-semibold text-gray-600 mb-1">
                                        {speedOption.level}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {speedOption.description}
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() =>
                                            isTesting
                                                ? handleStopTest()
                                                : handleTest(speedOption.value)
                                        }
                                        disabled={
                                            isTestActive &&
                                            testSpeed !== speedOption.value
                                        }
                                        className="w-full px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                                    >
                                        {isTesting ? "⏸ Arrêter" : "🧪 Tester"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleSelect(speedOption.value)
                                        }
                                        className={`w-full px-3 py-2 text-white text-sm rounded-lg transition font-bold ${speedOption.colorClass} ${
                                            isSelected && "ring-4 ring-offset-2"
                                        }`}
                                    >
                                        {isSelected
                                            ? "✓ Sélectionnée"
                                            : "✓ Choisir"}
                                    </button>
                                </div>
                            </div>
                        </Tooltip>
                    );
                })}
            </div>

            {/* Help message */}
            <div className="text-center text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">
                    👆 Testez les vitesses pour trouver celle qui vous convient,
                    puis cliquez sur "Choisir"
                </p>
                {selectedSpeed && (
                    <p className="mt-2 text-green-700 font-semibold">
                        ✓ Vitesse sélectionnée : {selectedSpeed} MLM - Cliquez
                        sur "Suivant" pour continuer
                    </p>
                )}
            </div>

            {/* Link to custom mode */}
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

            {/* Custom mode */}
            {showCustomMode && (
                <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-blue-400 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">
                            ⚙️ Réglage personnalisé
                        </h3>
                        <button
                            onClick={() => setShowCustomMode(false)}
                            className="text-sm text-gray-600 hover:text-gray-800"
                        >
                            ✕ Fermer
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Vitesse : {customSpeed} MLM
                            </label>
                        </div>
                        <input
                            type="range"
                            min="30"
                            max="110"
                            step="5"
                            value={customSpeed}
                            onChange={(e) =>
                                setCustomSpeed(Number(e.target.value))
                            }
                            className="w-full h-3 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span className="font-semibold">30</span>
                            <span className="font-semibold">50</span>
                            <span className="font-semibold">70</span>
                            <span className="font-semibold">90</span>
                            <span className="font-semibold">110</span>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm mb-4">
                        <p className="font-medium text-blue-800 mb-2">
                            📍 Zone pédagogique : {getEduscolZone(customSpeed)}
                        </p>
                        <p className="text-gray-700 text-xs">
                            💡 Les vitesses officielles (30-50-70-90-110)
                            correspondent aux repères Eduscol
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handleTest(customSpeed)}
                            disabled={isTestActive && testSpeed !== customSpeed}
                            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                        >
                            {isTestActive && testSpeed === customSpeed
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

SpeedSelector.propTypes = {
    onSpeedChange: PropTypes.func.isRequired,
    text: PropTypes.string,
    speedConfig: PropTypes.shape({
        speed: PropTypes.number,
        locked: PropTypes.bool,
    }),
};

export default SpeedSelector;
