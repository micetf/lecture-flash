/**
 * Speed selection component with test mode, custom speeds, and sharing
 * VERSION 3.8.0 : Migration vers constants.js centralisé
 *
 * Modifications v3.8.0 :
 * - Suppression SPEED_OPTIONS local (dupliqué)
 * - Import SPEEDS depuis @config/constants
 * - Import helpers (getSpeedLevel, getSpeedTooltip, getSpeedLabel)
 * - Suppression getSpeedLevelLabel local (remplacé par getSpeedLevel)
 * - Conservation getEduscolZone (spécifique au composant)
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onSpeedChange - Callback speed selection
 * @param {string} props.text - Text for speed testing
 * @param {Object} props.speedConfig - Speed config from URL {speed, locked}
 * @param {number} props.selectedSpeed - Initially selected speed
 * @param {string} props.sourceUrl - CodiMD source URL (for sharing)
 * @param {boolean} props.showCustomModal - Custom modal state (parent-managed)
 * @param {Function} props.setShowCustomModal - Custom modal setter
 * @param {boolean} props.showShareModal - Share modal state (parent-managed)
 * @param {Function} props.setShowShareModal - Share modal setter
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tooltip from "../../Tooltip";
import {
    SPEEDS,
    getSpeedLevel,
    getSpeedTooltip,
    getSpeedLabel,
} from "../../../config/constants";

/**
 * Obtient la zone Eduscol détaillée pour une vitesse donnée
 * (Fonction spécifique au composant, pas dans constants.js)
 *
 * @param {number} speed - Vitesse en MLM
 * @returns {string} Description zone Eduscol
 */
const getEduscolZone = (speed) => {
    if (speed <= 40) return "CP - début CE1 (déchiffrage)";
    if (speed <= 60) return "CE1 (lecture mot à mot)";
    if (speed <= 80) return "CE2 (lecture par groupes)";
    if (speed <= 100) return "CM1-CM2 (lecture fluide)";
    return "CM2+ (lecture experte)";
};

/**
 * Configuration des couleurs pour chaque vitesse prédéfinie
 * (Map depuis SPEEDS pour ajouter les colorClass)
 */
const SPEED_COLORS = {
    30: "bg-green-500 hover:bg-green-600",
    50: "bg-blue-500 hover:bg-blue-600",
    70: "bg-yellow-500 hover:bg-yellow-600",
    90: "bg-orange-500 hover:bg-orange-600",
    110: "bg-red-500 hover:bg-red-600",
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
            const isPredefined = SPEEDS.some(
                (s) => s.value === speedConfig.speed
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
     * Test d'une vitesse (démonstration)
     */
    const handleTest = (speed) => {
        if (isTestActive && testSpeed === speed) {
            // Arrêter le test
            setIsTestActive(false);
            setTestSpeed(null);
        } else {
            // Lancer le test
            setTestSpeed(speed);
            setIsTestActive(true);

            // Arrêt automatique après 10 secondes
            setTimeout(() => {
                setIsTestActive(false);
                setTestSpeed(null);
            }, 10000);
        }
    };

    // ========================================
    // HANDLERS: Sharing
    // ========================================

    /**
     * Génération du lien de partage et copie dans le presse-papier
     */
    const handleGenerateShareLink = async () => {
        if (!sourceUrl || !selectedSpeed) return;

        const params = new URLSearchParams({
            url: sourceUrl,
            speed: selectedSpeed,
            locked: shareLocked ? "true" : "false",
        });

        const baseUrl = `${window.location.origin}/index.html`;
        const shareUrl = `${baseUrl}?${params.toString()}`;

        try {
            // Tentative avec l'API moderne
            await navigator.clipboard.writeText(shareUrl);
            setShowShareSuccess(true);
            setTimeout(() => {
                setShowShareSuccess(false);
            }, 3000);
        } catch (err) {
            // Fallback pour navigateurs anciens
            const textArea = document.createElement("textarea");
            textArea.value = shareUrl;
            textArea.style.position = "fixed";
            textArea.style.top = "0";
            textArea.style.left = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand("copy");
                setShowShareSuccess(true);
                setTimeout(() => {
                    setShowShareSuccess(false);
                }, 3000);
            } catch (fallbackErr) {
                console.error("Erreur copie clipboard:", fallbackErr);
                alert(
                    "Impossible de copier automatiquement. " +
                        "Copiez-le manuellement : " +
                        shareUrl
                );
            }

            document.body.removeChild(textArea);
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
                        {getSpeedLevel(speedConfig.speed)})
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
                {SPEEDS.map((speed) => {
                    const isSelected =
                        selectedSpeed === speed.value && !isCustomSpeedSelected;
                    const isSuggested =
                        speedConfig?.speed === speed.value &&
                        !speedConfig.locked;

                    return (
                        <Tooltip
                            key={speed.value}
                            content={speed.tooltip}
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
                                        {speed.value}
                                    </p>
                                    <p className="text-sm text-gray-600 font-medium">
                                        mots/minute
                                    </p>
                                </div>

                                {/* Labels */}
                                <div className="text-center mb-4">
                                    <p className="font-semibold text-gray-800 mb-1">
                                        {speed.label}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {speed.level}
                                    </p>
                                </div>

                                {/* Boutons */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleTest(speed.value)}
                                        className="w-full px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                                    >
                                        🧪 Tester
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleSelect(speed.value)
                                        }
                                        className={`w-full px-3 py-2 text-white text-sm rounded-lg transition font-bold ${
                                            SPEED_COLORS[speed.value]
                                        } ${isSelected && "ring-4 ring-offset-2"}`}
                                    >
                                        {isSelected
                                            ? "✓ Sélectionnée"
                                            : "Choisir"}
                                    </button>
                                </div>
                            </div>
                        </Tooltip>
                    );
                })}

                {/* ======================================== */}
                {/* CARTE Vitesse personnalisée */}
                {/* ======================================== */}
                {isCustomSpeedSelected && (
                    <div className="border-2 border-purple-500 bg-purple-50 rounded-xl p-4 shadow-lg">
                        <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-purple-500 text-white font-semibold text-xs rounded-full">
                                ✓ Sélectionnée
                            </span>
                        </div>

                        {/* Vitesse */}
                        <div className="text-center mb-3">
                            <p className="text-4xl font-bold text-purple-900 mb-1">
                                {customSpeed}
                            </p>
                            <p className="text-sm text-purple-700 font-medium">
                                mots/minute
                            </p>
                        </div>

                        {/* Labels */}
                        <div className="text-center mb-4">
                            <p className="font-semibold text-purple-800 mb-1">
                                Personnalisée
                            </p>
                            <p className="text-sm text-purple-600">
                                {getSpeedLevel(customSpeed)}
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
            {/* BOUTON PARTAGE (si sourceUrl présent) */}
            {/* ======================================== */}
            {sourceUrl && selectedSpeed && (
                <div className="border-t pt-6 mt-6">
                    <button
                        onClick={() => setShowShareModal(true)}
                        className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                    >
                        🔗 Partager ce texte avec vos élèves
                    </button>
                </div>
            )}

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

                        {/* Curseur de vitesse */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Vitesse de lecture
                            </label>
                            <input
                                type="range"
                                min="20"
                                max="200"
                                step="5"
                                value={customSpeed}
                                onChange={(e) =>
                                    setCustomSpeed(Number(e.target.value))
                                }
                                className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>20 MLM</span>
                                <span>200 MLM</span>
                            </div>
                        </div>

                        {/* Affichage vitesse sélectionnée */}
                        <div className="mb-6 p-4 bg-purple-50 rounded-lg text-center">
                            <p className="text-4xl font-bold text-purple-900 mb-2">
                                {customSpeed}
                            </p>
                            <p className="text-sm text-purple-700 font-medium mb-2">
                                mots par minute
                            </p>
                            <p className="text-xs text-purple-600">
                                {getEduscolZone(customSpeed)}
                            </p>
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

                        {/* Vitesse actuelle */}
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-center">
                            <p className="text-sm text-blue-700 mb-1">
                                Vitesse sélectionnée
                            </p>
                            <p className="text-2xl font-bold text-blue-900">
                                {selectedSpeed} MLM
                            </p>
                            <p className="text-xs text-blue-600">
                                {getSpeedLevel(selectedSpeed)}
                            </p>
                        </div>

                        {/* Choix du mode */}
                        <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                                Mode de partage :
                            </p>
                            <div className="space-y-2">
                                <label className="flex items-start gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        checked={!shareLocked}
                                        onChange={() => setShareLocked(false)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="font-semibold">
                                            💡 Vitesse suggérée
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            L'élève peut modifier la vitesse
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-start gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        checked={shareLocked}
                                        onChange={() => setShareLocked(true)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="font-semibold">
                                            🔒 Vitesse imposée
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Lecture automatique sans
                                            modification
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Bouton génération */}
                        <button
                            onClick={handleGenerateShareLink}
                            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold mb-3"
                        >
                            📋 Copier le lien
                        </button>

                        {/* Message succès */}
                        {showShareSuccess && (
                            <div className="p-3 bg-green-50 text-green-800 rounded-lg text-center text-sm">
                                ✓ Lien copié dans le presse-papier !
                                <br />
                                <span className="text-xs">
                                    Vous pouvez maintenant le coller dans votre
                                    ENT, Digipad, ou l'envoyer par email.
                                </span>
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
