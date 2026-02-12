/**
 * Speed Selector Component with discreet sharing button
 * VERSION 3.5.0 : Partage discret (bouton + modale) - Conformité Tricot
 *
 * @component
 * @param {Object} props
 * @param {function} props.onSpeedChange - Callback quand vitesse sélectionnée
 * @param {string} [props.text] - Texte pour la preview (optionnel)
 * @param {Object} [props.speedConfig] - Config vitesse depuis URL
 * @param {number} [props.selectedSpeed] - Vitesse déjà sélectionnée (persistance)
 * @param {string} [props.sourceUrl] - URL cloud si texte chargé depuis CodiMD
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tooltip from "../../Tooltip";

// ========================================
// CONSTANTS
// ========================================
const SPEED_OPTIONS = [
    {
        value: 30,
        label: "Très lent",
        level: "CP - début CE1",
        description:
            "Idéal pour CP - début CE1 (déchiffrage en cours d'acquisition)",
        colorClass: "bg-blue-500 hover:bg-blue-600",
    },
    {
        value: 50,
        label: "Lent",
        level: "CE1",
        description: "Recommandé pour CE1 (lecture mot à mot)",
        colorClass: "bg-green-500 hover:bg-green-600",
    },
    {
        value: 70,
        label: "Moyen",
        level: "CE2",
        description: "Adapté au CE2 (lecture par groupes de mots)",
        colorClass: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
        value: 90,
        label: "Rapide",
        level: "CM1-CM2",
        description: "Pour CM1-CM2 (lecture fluide)",
        colorClass: "bg-orange-500 hover:bg-orange-600",
    },
    {
        value: 110,
        label: "Très rapide",
        level: "CM2 et +",
        description: "Pour CM2 et + (lecture experte)",
        colorClass: "bg-red-500 hover:bg-red-600",
    },
];

const getSpeedLevelLabel = (speed) => {
    const labels = {
        30: "CP - début CE1",
        50: "CE1",
        70: "CE2",
        90: "CM1-CM2",
        110: "CM2 et +",
    };
    return labels[speed] || "Personnalisé";
};

const getEduscolZone = (speed) => {
    if (speed <= 40) return "CP - début CE1 (déchiffrage)";
    if (speed <= 60) return "CE1 (lecture mot à mot)";
    if (speed <= 80) return "CE2 (lecture par groupes)";
    if (speed <= 100) return "CM1-CM2 (lecture fluide)";
    return "CM2+ (lecture experte)";
};

function SpeedSelector({
    onSpeedChange,
    text,
    speedConfig,
    selectedSpeed: initialSelectedSpeed,
    sourceUrl,
}) {
    // ========================================
    // STATE: Speed selection
    // ========================================
    const [selectedSpeed, setSelectedSpeed] = useState(
        speedConfig?.speed || initialSelectedSpeed || 70
    );
    const [showCustomMode, setShowCustomMode] = useState(false);
    const [customSpeed, setCustomSpeed] = useState(70);

    // Test mode
    const [isTestActive, setIsTestActive] = useState(false);
    const [testSpeed, setTestSpeed] = useState(null);

    // ========================================
    // STATE: Sharing modal (nouveau - discret)
    // ========================================
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareLocked, setShareLocked] = useState(false);
    const [showShareSuccess, setShowShareSuccess] = useState(false);

    // ========================================
    // EFFECT: Sync with external props
    // ========================================
    useEffect(() => {
        if (speedConfig?.speed) {
            setSelectedSpeed(speedConfig.speed);
        } else if (
            initialSelectedSpeed &&
            initialSelectedSpeed !== selectedSpeed
        ) {
            setSelectedSpeed(initialSelectedSpeed);
        }
    }, [speedConfig, initialSelectedSpeed]);

    // ========================================
    // EFFECT: Close modal on Escape key
    // ========================================
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && showShareModal) {
                setShowShareModal(false);
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [showShareModal]);

    // ========================================
    // HANDLERS: Speed selection
    // ========================================
    const handleSelect = (speed) => {
        setSelectedSpeed(speed);
        onSpeedChange(speed);
        setShowCustomMode(false);
    };

    const handleTest = (speed) => {
        if (isTestActive && testSpeed === speed) {
            setIsTestActive(false);
            setTestSpeed(null);
            return;
        }

        setTestSpeed(speed);
        setIsTestActive(true);

        setTimeout(() => {
            setIsTestActive(false);
            setTestSpeed(null);
        }, 10000);
    };

    // ========================================
    // HANDLER: Share link generation
    // ========================================
    const handleGenerateShareLink = async () => {
        const baseUrl = `${window.location.origin}/index.html`;
        const params = new URLSearchParams({
            url: sourceUrl,
            speed: selectedSpeed,
        });

        if (shareLocked) {
            params.set("locked", "true");
        }

        const shareUrl = `${baseUrl}?${params.toString()}`;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setShowShareSuccess(true);
            setTimeout(() => {
                setShowShareSuccess(false);
            }, 3000);
        } catch (err) {
            console.error("Erreur copie lien:", err);
            // Fallback pour navigateurs plus anciens
            const textArea = document.createElement("textarea");
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
                setShowShareSuccess(true);
                setTimeout(() => {
                    setShowShareSuccess(false);
                }, 3000);
            } catch (fallbackErr) {
                console.error("Fallback copie échoué:", fallbackErr);
                alert(
                    "Impossible de copier le lien automatiquement. Copiez-le manuellement."
                );
            }
            document.body.removeChild(textArea);
        }
    };

    // ========================================
    // COMPUTED: Is speed suggested?
    // ========================================
    const isSuggested = (speed) => {
        return (
            speedConfig && !speedConfig.locked && speedConfig.speed === speed
        );
    };

    // ========================================
    // RENDER
    // ========================================
    return (
        <div className="space-y-6">
            {/* Suggested speed message */}
            {speedConfig && !speedConfig.locked && (
                <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                    <p className="text-yellow-900 font-semibold mb-2">
                        ⭐ Vitesse recommandée : {speedConfig.speed} MLM (
                        {getSpeedLevelLabel(speedConfig.speed)})
                    </p>
                    <p className="text-sm text-yellow-800">
                        💡 Votre enseignant a pré-sélectionné cette vitesse,
                        mais vous pouvez en choisir une autre si besoin.
                    </p>
                </div>
            )}

            {/* Level 1: 5 guided buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SPEED_OPTIONS.map((speedOption) => {
                    const isSelected = selectedSpeed === speedOption.value;
                    const isSuggestedSpeed = isSuggested(speedOption.value);
                    const isTestingThis =
                        isTestActive && testSpeed === speedOption.value;

                    return (
                        <Tooltip
                            key={speedOption.value}
                            content={speedOption.description}
                            position="top"
                        >
                            <div
                                className={`border-2 rounded-lg p-4 transition-all ${
                                    isSuggestedSpeed
                                        ? "border-yellow-400 bg-yellow-50 ring-2 ring-yellow-300"
                                        : isSelected
                                          ? "border-blue-600 bg-blue-50 shadow-lg"
                                          : "border-gray-300 bg-white hover:border-gray-400"
                                }`}
                            >
                                {isSuggestedSpeed && (
                                    <span className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 font-semibold text-xs rounded-full mb-2">
                                        ⭐ Suggérée
                                    </span>
                                )}

                                <div className="text-center mb-3">
                                    <p className="text-3xl font-bold text-gray-800">
                                        {speedOption.value}
                                    </p>
                                    <p className="text-sm text-gray-600">MLM</p>
                                </div>

                                <div className="mb-3">
                                    <p className="text-sm font-semibold text-gray-700">
                                        {speedOption.label}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {speedOption.level}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() =>
                                            handleTest(speedOption.value)
                                        }
                                        disabled={
                                            isTestActive &&
                                            testSpeed !== speedOption.value
                                        }
                                        className="w-full px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                                    >
                                        {isTestingThis
                                            ? "⏸ Arrêter"
                                            : "🧪 Tester"}
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

            {/* Link to custom mode (hidden if speedConfig present) */}
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

            {/* Custom mode: slider */}
            {showCustomMode && (
                <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            ⚙️ Réglage personnalisé
                        </h3>
                        <button
                            onClick={() => setShowCustomMode(false)}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    <div className="text-center mb-4">
                        <p className="text-4xl font-bold text-blue-900">
                            {customSpeed} MLM
                        </p>
                    </div>

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
                            className="w-full h-2 bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(234, 179, 8) 50%, rgb(239, 68, 68) 100%)`,
                            }}
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

            {/* ======================================== */}
            {/* NOUVEAU: Bouton partage discret */}
            {/* ======================================== */}
            {sourceUrl && selectedSpeed && (
                <div className="text-center mt-6 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => setShowShareModal(true)}
                        className="text-sm text-blue-600 hover:text-blue-800 underline font-medium transition"
                    >
                        🔗 Partager ce texte avec vos élèves
                    </button>
                </div>
            )}

            {/* ======================================== */}
            {/* MODALE de partage (légère et compacte) */}
            {/* ======================================== */}
            {showShareModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowShareModal(false)}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-labelledby="share-modal-title"
                        aria-modal="true"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <h3
                                id="share-modal-title"
                                className="text-lg font-semibold text-gray-800"
                            >
                                🔗 Partager avec vos élèves
                            </h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition"
                                aria-label="Fermer"
                            >
                                ×
                            </button>
                        </div>

                        {/* Selected speed display */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
                            <p className="text-xs text-gray-600 mb-1">
                                Vitesse sélectionnée
                            </p>
                            <p className="text-2xl font-bold text-blue-900">
                                {selectedSpeed} MLM
                            </p>
                            <p className="text-xs text-gray-600">
                                {getSpeedLevelLabel(selectedSpeed)}
                            </p>
                        </div>

                        {/* Locked/unlocked choice (compact) */}
                        <div className="mb-4 space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="lockMode"
                                    checked={!shareLocked}
                                    onChange={() => setShareLocked(false)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                    💡 Suggérée (modifiable)
                                </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="lockMode"
                                    checked={shareLocked}
                                    onChange={() => setShareLocked(true)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                    🔒 Imposée (auto-démarrage)
                                </span>
                            </label>
                        </div>

                        {/* Copy button */}
                        <button
                            onClick={handleGenerateShareLink}
                            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            📋 Copier le lien
                        </button>

                        {/* Success message */}
                        {showShareSuccess && (
                            <div className="mt-3 p-2 bg-green-100 text-green-800 text-sm rounded text-center animate-fade-in">
                                ✅ Lien copié dans le presse-papier !
                            </div>
                        )}

                        {/* Help text */}
                        <p className="mt-4 text-xs text-gray-500 text-center">
                            Collez ce lien dans votre ENT, Digipad ou email
                        </p>
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
    selectedSpeed: PropTypes.number,
    sourceUrl: PropTypes.string,
};

export default SpeedSelector;
