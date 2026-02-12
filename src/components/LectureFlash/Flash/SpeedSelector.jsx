/**
 * SpeedSelector - Composant de sélection de vitesse de lecture
 * VERSION 3.6.0 FINAL : Simplifié - Titre géré par StepContainer
 *
 * Modifications v3.6.0 :
 * - Suppression de la gestion du titre (responsabilité de StepContainer)
 * - States des modales gérés par le parent (LectureFlash)
 * - Focus sur la logique métier (grille vitesses, curseur, partage)
 * - Architecture cohérente et maintenable
 *
 * @component
 * @param {Function} onSpeedChange - Callback appelé lors de la sélection de vitesse
 * @param {string} text - Texte à utiliser pour les tests de vitesse
 * @param {Object} speedConfig - Configuration de vitesse depuis URL (speed, locked)
 * @param {number} selectedSpeed - Vitesse pré-sélectionnée (mémorisation entre étapes)
 * @param {string} sourceUrl - URL source du texte (pour afficher le partage)
 * @param {boolean} showCustomModal - État de la modale curseur (géré par parent)
 * @param {Function} setShowCustomModal - Setter pour la modale curseur
 * @param {boolean} showShareModal - État de la modale partage (géré par parent)
 * @param {Function} setShowShareModal - Setter pour la modale partage
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tooltip from "../../Tooltip";

// ========================================
// CONSTANTES
// ========================================

/**
 * Vitesses officielles recommandées (Eduscol cycles 2-3)
 * Lecture à voix haute (orale) : 30-110 MLM
 */
const SPEED_OPTIONS = [
    {
        value: 30,
        label: "Très lent",
        level: "CP - début CE1",
        description: "Pour CP et début CE1 (déchiffrage)",
        colorClass: "bg-blue-500 hover:bg-blue-600",
    },
    {
        value: 50,
        label: "Lent",
        level: "CE1",
        description: "Pour CE1 (lecture mot à mot)",
        colorClass: "bg-green-500 hover:bg-green-600",
    },
    {
        value: 70,
        label: "Moyen",
        level: "CE2",
        description: "Pour CE2 (lecture par groupes de mots)",
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

/**
 * Obtient le label du niveau scolaire pour une vitesse donnée
 */
const getSpeedLevelLabel = (speed) => {
    const option = SPEED_OPTIONS.find((opt) => opt.value === speed);
    if (option) return option.level;

    // Pour vitesses personnalisées
    if (speed <= 40) return "CP - début CE1";
    if (speed <= 60) return "CE1";
    if (speed <= 80) return "CE2";
    if (speed <= 100) return "CM1-CM2";
    return "CM2 et +";
};

/**
 * Obtient la zone Eduscol pour une vitesse donnée
 */
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
    showCustomModal,
    setShowCustomModal,
    showShareModal,
    setShowShareModal,
}) {
    // ========================================
    // STATE: Speed selection
    // ========================================
    const [selectedSpeed, setSelectedSpeed] = useState(
        speedConfig?.speed || initialSelectedSpeed || null
    );

    // Vitesse personnalisée (si l'utilisateur utilise le curseur)
    const [customSpeed, setCustomSpeed] = useState(70);
    const [isCustomSpeedSelected, setIsCustomSpeedSelected] = useState(false);

    // Test mode
    const [isTestActive, setIsTestActive] = useState(false);
    const [testSpeed, setTestSpeed] = useState(null);

    // ========================================
    // STATE: Sharing
    // ========================================
    const [shareLocked, setShareLocked] = useState(false);
    const [showShareSuccess, setShowShareSuccess] = useState(false);

    // ========================================
    // EFFECTS
    // ========================================

    /**
     * Gestion de la touche Escape pour fermer les modales
     */
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                setShowCustomModal(false);
                setShowShareModal(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [setShowCustomModal, setShowShareModal]);

    /**
     * Pré-sélection visuelle si speedConfig présent
     */
    useEffect(() => {
        if (speedConfig?.speed) {
            setSelectedSpeed(speedConfig.speed);
            // Vérifier si c'est une vitesse personnalisée
            const isPredefined = SPEED_OPTIONS.some(
                (opt) => opt.value === speedConfig.speed
            );
            if (!isPredefined) {
                setIsCustomSpeedSelected(true);
                setCustomSpeed(speedConfig.speed);
            }
        }
    }, [speedConfig]);

    // ========================================
    // HANDLERS: Speed selection
    // ========================================

    /**
     * Sélection d'une vitesse prédéfinie
     */
    const handleSelect = (speed) => {
        setSelectedSpeed(speed);
        setIsCustomSpeedSelected(false);
        onSpeedChange(speed);
    };

    /**
     * Sélection de la vitesse personnalisée depuis le curseur
     */
    const handleSelectCustom = () => {
        setSelectedSpeed(customSpeed);
        setIsCustomSpeedSelected(true);
        onSpeedChange(customSpeed);
        setShowCustomModal(false);
    };

    /**
     * Test d'une vitesse (preview 10 secondes)
     */
    const handleTest = (speed) => {
        if (isTestActive) {
            setIsTestActive(false);
            setTestSpeed(null);
            return;
        }

        setIsTestActive(true);
        setTestSpeed(speed);

        setTimeout(() => {
            setIsTestActive(false);
            setTestSpeed(null);
        }, 10000);
    };

    // ========================================
    // HANDLERS: Sharing
    // ========================================

    /**
     * Génération et copie du lien de partage
     */
    const handleGenerateShareLink = async () => {
        if (!sourceUrl || !selectedSpeed) return;

        const baseUrl = `${window.location.origin}/index.html`;
        const params = new URLSearchParams({
            url: sourceUrl,
            speed: selectedSpeed,
        });

        if (shareLocked) {
            params.append("locked", "true");
        }

        const shareUrl = `${baseUrl}?${params.toString()}`;

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(shareUrl);
            } else {
                // Fallback pour navigateurs anciens
                const textArea = document.createElement("textarea");
                textArea.value = shareUrl;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }

            setShowShareSuccess(true);
            setTimeout(() => {
                setShowShareSuccess(false);
            }, 3000);
        } catch (err) {
            console.error("Erreur lors de la copie du lien:", err);
            alert(
                "Impossible de copier le lien automatiquement. Copiez-le manuellement : " +
                    shareUrl
            );
        }
    };

    // ========================================
    // RENDER: Test Animation Preview
    // ========================================

    if (isTestActive && testSpeed) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 text-center">
                <div className="mb-6">
                    <p className="text-3xl font-bold text-blue-900 mb-2">
                        Test en cours : {testSpeed} MLM
                    </p>
                    <p className="text-gray-600">
                        Aperçu de la vitesse pendant 10 secondes
                    </p>
                </div>

                <div className="bg-white rounded-lg p-6 mb-6 min-h-[200px] flex items-center justify-center">
                    <div className="text-4xl font-bold text-gray-800 animate-pulse">
                        {text
                            ? text.split(" ").slice(0, 5).join(" ") + "..."
                            : "Exemple de texte..."}
                    </div>
                </div>

                <button
                    onClick={() => handleTest(testSpeed)}
                    className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
                >
                    ⏸ Arrêter le test
                </button>
            </div>
        );
    }

    // ========================================
    // RENDER: Main Interface
    // ========================================

    return (
        <div>
            {/* Message si vitesse suggérée (locked=false) */}
            {speedConfig && !speedConfig.locked && (
                <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                    <p className="text-yellow-800 font-semibold">
                        ⭐ Vitesse recommandée pour cette activité :{" "}
                        {speedConfig.speed} MLM (
                        {getSpeedLevelLabel(speedConfig.speed)})
                    </p>
                    <p className="text-sm text-yellow-700 mt-2">
                        💡 Votre enseignant a pré-sélectionné cette vitesse,
                        mais vous pouvez en choisir une autre si besoin.
                    </p>
                </div>
            )}

            {/* ======================================== */}
            {/* GRILLE des 5 vitesses prédéfinies */}
            {/* ======================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {SPEED_OPTIONS.map((speedOption) => {
                    const isSelected =
                        selectedSpeed === speedOption.value &&
                        !isCustomSpeedSelected;
                    const isSuggested =
                        speedConfig?.speed === speedOption.value &&
                        !speedConfig.locked;

                    return (
                        <Tooltip
                            key={speedOption.value}
                            content={`${speedOption.value} mots/min - ${speedOption.description}`}
                            position="top"
                        >
                            <div
                                className={`border-2 rounded-xl p-4 transition-all transform hover:scale-105 ${
                                    isSuggested
                                        ? "border-yellow-400 bg-yellow-50 shadow-lg ring-2 ring-yellow-300"
                                        : isSelected
                                          ? "border-blue-500 bg-blue-50 shadow-lg"
                                          : "border-gray-300 bg-white hover:border-gray-400"
                                }`}
                            >
                                {/* Badge suggérée */}
                                {isSuggested && (
                                    <div className="mb-2">
                                        <span className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 font-semibold text-xs rounded-full">
                                            ⭐ Suggérée
                                        </span>
                                    </div>
                                )}

                                {/* Badge sélectionnée */}
                                {isSelected && !isSuggested && (
                                    <div className="mb-2">
                                        <span className="inline-block px-3 py-1 bg-blue-500 text-white font-semibold text-xs rounded-full">
                                            ✓ Sélectionnée
                                        </span>
                                    </div>
                                )}

                                {/* Vitesse */}
                                <div className="text-center mb-3">
                                    <p className="text-4xl font-bold text-gray-900 mb-1">
                                        {speedOption.value}
                                    </p>
                                    <p className="text-sm text-gray-600 font-medium">
                                        mots/minute
                                    </p>
                                </div>

                                {/* Labels */}
                                <div className="text-center mb-4">
                                    <p className="font-semibold text-gray-800 mb-1">
                                        {speedOption.label}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {speedOption.level}
                                    </p>
                                </div>

                                {/* Boutons */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() =>
                                            handleTest(speedOption.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                                    >
                                        🧪 Tester
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

                {/* ======================================== */}
                {/* TUILE vitesse personnalisée (si sélectionnée) */}
                {/* ======================================== */}
                {isCustomSpeedSelected && (
                    <div className="border-2 rounded-xl p-4 border-purple-500 bg-purple-50 shadow-lg">
                        {/* Badge personnalisée */}
                        <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-purple-500 text-white font-semibold text-xs rounded-full">
                                ✓ Sélectionnée
                            </span>
                        </div>

                        {/* Vitesse */}
                        <div className="text-center mb-3">
                            <p className="text-4xl font-bold text-gray-900 mb-1">
                                {customSpeed}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">
                                mots/minute
                            </p>
                        </div>

                        {/* Labels */}
                        <div className="text-center mb-4">
                            <p className="font-semibold text-gray-800 mb-1">
                                Personnalisée
                            </p>
                            <p className="text-sm text-gray-600">
                                {getSpeedLevelLabel(customSpeed)}
                            </p>
                        </div>

                        {/* Boutons */}
                        <div className="space-y-2">
                            <button
                                onClick={() => handleTest(customSpeed)}
                                className="w-full px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                            >
                                🧪 Tester
                            </button>
                            <button
                                onClick={() => setShowCustomModal(true)}
                                className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold text-sm"
                            >
                                ⚙️ Modifier
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Message d'aide */}
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

            {/* ======================================== */}
            {/* MODALE Réglage personnalisé */}
            {/* ======================================== */}
            {showCustomModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowCustomModal(false)}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-labelledby="custom-modal-title"
                        aria-modal="true"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <h3
                                id="custom-modal-title"
                                className="text-lg font-semibold text-gray-800"
                            >
                                ⚙️ Réglage personnalisé
                            </h3>
                            <button
                                onClick={() => setShowCustomModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition"
                                aria-label="Fermer"
                            >
                                ×
                            </button>
                        </div>

                        {/* Message pédagogique */}
                        <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                                💡 Les vitesses officielles (30-50-70-90-110)
                                correspondent aux repères Eduscol pour les
                                cycles 2 et 3. Utilisez ce réglage pour affiner
                                si nécessaire.
                            </p>
                        </div>

                        {/* Affichage vitesse actuelle */}
                        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center">
                            <p className="text-xs text-gray-600 mb-1">
                                Vitesse choisie
                            </p>
                            <p className="text-5xl font-bold text-purple-900 mb-2">
                                {customSpeed}
                            </p>
                            <p className="text-sm text-gray-700 font-medium">
                                mots par minute
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                {getEduscolZone(customSpeed)}
                            </p>
                        </div>

                        {/* Curseur */}
                        <div className="mb-6">
                            <input
                                type="range"
                                min="30"
                                max="110"
                                step="5"
                                value={customSpeed}
                                onChange={(e) =>
                                    setCustomSpeed(parseInt(e.target.value, 10))
                                }
                                className="w-full h-3 bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex justify-between text-xs text-gray-600 mt-2">
                                <span>30</span>
                                <span>50</span>
                                <span>70</span>
                                <span>90</span>
                                <span>110</span>
                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="space-y-2">
                            <button
                                onClick={() => handleTest(customSpeed)}
                                className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-semibold"
                            >
                                🧪 Tester {customSpeed} MLM
                            </button>
                            <button
                                onClick={handleSelectCustom}
                                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold"
                            >
                                ✓ Choisir {customSpeed} MLM
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================== */}
            {/* MODALE Partage */}
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

                        {/* Locked/unlocked choice */}
                        <div className="mb-4 space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="lockMode"
                                    checked={!shareLocked}
                                    onChange={() => setShareLocked(false)}
                                    className="w-4 h-4"
                                />
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-800 group-hover:text-green-700 transition">
                                        💡 Vitesse suggérée
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Les élèves peuvent la modifier
                                    </p>
                                </div>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="lockMode"
                                    checked={shareLocked}
                                    onChange={() => setShareLocked(true)}
                                    className="w-4 h-4"
                                />
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-800 group-hover:text-orange-700 transition">
                                        🔒 Vitesse imposée
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Les élèves ne peuvent pas la modifier
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Generate button */}
                        <button
                            onClick={handleGenerateShareLink}
                            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg"
                        >
                            📋 Copier le lien
                        </button>

                        {/* Success message */}
                        {showShareSuccess && (
                            <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-lg text-green-800 text-sm animate-fade-in">
                                ✅ Lien copié ! Vous pouvez maintenant le coller
                                dans votre ENT, Digipad, ou l'envoyer par email.
                            </div>
                        )}

                        {/* Help text */}
                        <p className="text-xs text-gray-500 text-center mt-4">
                            Le lien contiendra le texte et la vitesse configurée
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ========================================
// PROPTYPES
// ========================================

SpeedSelector.propTypes = {
    /** Callback appelé lors de la sélection d'une vitesse */
    onSpeedChange: PropTypes.func.isRequired,
    /** Texte utilisé pour les tests de vitesse */
    text: PropTypes.string,
    /** Configuration de vitesse depuis URL {speed: number, locked: boolean} */
    speedConfig: PropTypes.shape({
        speed: PropTypes.number,
        locked: PropTypes.bool,
    }),
    /** Vitesse initialement sélectionnée (mémorisation) */
    selectedSpeed: PropTypes.number,
    /** URL source du texte (pour le partage) */
    sourceUrl: PropTypes.string,
    /** État de la modale curseur (géré par parent) */
    showCustomModal: PropTypes.bool.isRequired,
    /** Setter pour la modale curseur */
    setShowCustomModal: PropTypes.func.isRequired,
    /** État de la modale partage (géré par parent) */
    showShareModal: PropTypes.bool.isRequired,
    /** Setter pour la modale partage */
    setShowShareModal: PropTypes.func.isRequired,
};

export default SpeedSelector;
