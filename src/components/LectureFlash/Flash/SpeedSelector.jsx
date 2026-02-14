/**
 * Composant de sélection de vitesse de lecture
 * VERSION 3.9.17 : Corrections bugs vitesse personnalisée
 *
 * Corrections v3.9.17 :
 * - 🐛 FIX : customSpeed reset à 70 MLM au retour (initialisation intelligente)
 * - 🐛 FIX : Carte vitesse perso toujours visible (affichage conditionnel)
 *
 * Fonctionnalités :
 * - 5 vitesses prédéfinies conformes Eduscol (30-110 MLM)
 * - Vitesse personnalisée avec curseur 20-200 MLM
 * - Configuration partage si texte CodiMD (locked/unlocked)
 * - Gestion tooltips pédagogiques
 * - Badge "Suggérée" si lien partagé avec locked=false
 * - Badge "Sélectionnée" sur la vitesse active
 *
 * @component
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tooltip from "../../Tooltip";
import DisplayOptions from "./DisplayOptions";
import { SPEEDS } from "../../../config/constants";
import {
    getSpeedLevel,
    getSpeedTooltip,
    getSpeedLabel,
} from "../../../config/constants";
import { getEduscolZone } from "@services/speedCalculations";

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
    speedConfig,
    selectedSpeed: initialSelectedSpeed,
    sourceUrl,
    showCustomModal,
    setShowCustomModal,
    showShareModal,
    setShowShareModal,
    onDisplayOptionsChange,
}) {
    // ========================================
    // HELPERS
    // ========================================

    /**
     * Vérifie si une vitesse est prédéfinie
     * @param {number} speed - Vitesse à vérifier
     * @returns {boolean}
     */
    const isPredefinedSpeed = (speed) => SPEEDS.some((s) => s.value === speed);

    // ========================================
    // STATE: Speed selection
    // ========================================
    const [selectedSpeed, setSelectedSpeed] = useState(
        speedConfig?.speed || initialSelectedSpeed || null
    );

    // BUG FIX v3.9.17 : Initialiser customSpeed depuis selectedSpeed si vitesse non-prédéfinie
    const [customSpeed, setCustomSpeed] = useState(() => {
        const initial = speedConfig?.speed || initialSelectedSpeed;
        if (initial && !isPredefinedSpeed(initial)) {
            return initial; // Récupérer la vitesse perso précédente (ex: 150 MLM)
        }
        return 70; // Défaut si jamais utilisé
    });

    const [isCustomSpeedSelected, setIsCustomSpeedSelected] = useState(() => {
        const initial = speedConfig?.speed || initialSelectedSpeed;
        return initial ? !isPredefinedSpeed(initial) : false;
    });

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
            if (!isPredefinedSpeed(speedConfig.speed)) {
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

            {/* Grille des 5 vitesses prédéfinies + vitesse personnalisée */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {SPEEDS.map((speed) => (
                    <div
                        key={speed.value}
                        className={`
                            relative bg-white rounded-xl border-2 p-6 shadow-sm
                            transition-all hover:shadow-md
                            ${
                                selectedSpeed === speed.value
                                    ? "border-primary-600 ring-2 ring-primary-200"
                                    : "border-gray-200 hover:border-gray-300"
                            }
                        `}
                    >
                        {/* Badge sélection */}
                        {selectedSpeed === speed.value && (
                            <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                ✓ Sélectionnée
                            </div>
                        )}

                        {/* Badge suggérée */}
                        {speedConfig?.speed === speed.value &&
                            !speedConfig.locked && (
                                <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                                    ⭐ Suggérée
                                </div>
                            )}

                        {/* Label vitesse */}
                        <div className="text-center mb-4">
                            <p className="text-4xl font-extrabold text-gray-900 mb-1">
                                {speed.value}
                                <span className="text-lg font-normal text-gray-600 ml-1">
                                    MLM
                                </span>
                            </p>
                            <p className="text-sm font-semibold text-gray-700">
                                {speed.level}
                            </p>
                        </div>

                        {/* Tooltip */}
                        <Tooltip content={speed.tooltip} position="top">
                            <div className="text-xs text-gray-500 text-center mb-4 cursor-help">
                                {speed.tooltip.substring(0, 40)}...
                            </div>
                        </Tooltip>

                        {/* Bouton Choisir */}
                        <button
                            onClick={() => handleSelect(speed.value)}
                            className={`
                                w-full py-3 rounded-lg font-bold transition-all
                                ${SPEED_COLORS[speed.value]} text-white
                                hover:shadow-md active:scale-95
                            `}
                        >
                            Choisir
                        </button>
                    </div>
                ))}

                {/* Vitesse personnalisée (petite carte) - BUG FIX v3.9.17 : Affichage conditionnel */}
                {isCustomSpeedSelected && (
                    <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-6">
                        <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            ✓ Sélectionnée
                        </div>

                        <div className="text-center mb-4">
                            <p className="text-3xl font-extrabold text-purple-900 mb-1">
                                {customSpeed}
                                <span className="text-base font-normal text-purple-700 ml-1">
                                    MLM
                                </span>
                            </p>
                            <p className="text-xs text-purple-700 font-medium">
                                {getEduscolZone(customSpeed)}
                            </p>
                        </div>

                        {/* Bouton Modifier */}
                        <button
                            onClick={() => setShowCustomModal(true)}
                            className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold text-sm"
                        >
                            ⚙️ Modifier
                        </button>
                    </div>
                )}
            </div>

            {/* Message d'aide */}
            <div className="text-center text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">
                    💡 Vous pourrez ajuster la vitesse après le lancement en
                    revenant à cette étape
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
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* En-tête */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                ⚙️ Réglage personnalisé
                            </h3>
                            <button
                                onClick={() => setShowCustomModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                                aria-label="Fermer"
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

                        {/* Affichage grande valeur */}
                        <div className="text-center mb-8">
                            <p className="text-6xl font-extrabold text-purple-900 mb-2">
                                {customSpeed}
                                <span className="text-2xl font-normal text-purple-700 ml-2">
                                    MLM
                                </span>
                            </p>
                            <p className="text-sm text-purple-700 font-medium">
                                {getEduscolZone(customSpeed)}
                            </p>
                        </div>

                        {/* Curseur */}
                        <div className="mb-8">
                            <input
                                type="range"
                                min="20"
                                max="200"
                                step="5"
                                value={customSpeed}
                                onChange={(e) =>
                                    setCustomSpeed(parseInt(e.target.value))
                                }
                                className="w-full h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    accentColor: "#9333ea",
                                }}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>20 MLM</span>
                                <span>200 MLM</span>
                            </div>
                        </div>

                        {/* Message pédagogique */}
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-purple-800">
                                <strong>📖 Repères Eduscol :</strong> Les
                                vitesses recommandées vont de 30 MLM (CP) à 110
                                MLM (CM2). Vous pouvez ajuster selon le niveau
                                de votre élève.
                            </p>
                        </div>

                        {/* Boutons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCustomModal(false)}
                                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSelectCustom}
                                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold"
                            >
                                ✓ Choisir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================== */}
            {/* MODALE Partage */}
            {/* ======================================== */}
            {showShareModal && sourceUrl && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowShareModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* En-tête */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                🔗 Partager avec les élèves
                            </h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                                aria-label="Fermer"
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

                        {/* Options de partage */}
                        <div className="space-y-4 mb-6">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="shareMode"
                                    checked={!shareLocked}
                                    onChange={() => setShareLocked(false)}
                                    className="mt-1"
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        💡 Vitesse suggérée
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        L'élève peut modifier la vitesse si
                                        besoin
                                    </p>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="shareMode"
                                    checked={shareLocked}
                                    onChange={() => setShareLocked(true)}
                                    className="mt-1"
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        🔒 Vitesse imposée
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        La lecture démarre automatiquement à la
                                        vitesse configurée
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Bouton génération lien */}
                        <button
                            onClick={handleGenerateShareLink}
                            disabled={!selectedSpeed}
                            className={`w-full py-3 rounded-lg font-bold transition ${
                                selectedSpeed
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {selectedSpeed
                                ? "📋 Générer et copier le lien"
                                : "⚠️ Sélectionnez une vitesse d'abord"}
                        </button>

                        {/* Message succès */}
                        {showShareSuccess && (
                            <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg">
                                <p className="text-green-800 font-semibold text-center">
                                    ✅ Lien copié dans le presse-papier !
                                    <br />
                                    <span className="text-xs">
                                        Vous pouvez maintenant le coller dans
                                        votre ENT, Digipad, ou l'envoyer par
                                        email.
                                    </span>
                                </p>
                            </div>
                        )}

                        {/* Help text */}
                        <p className="text-xs text-gray-500 text-center mt-4">
                            Le lien contiendra le texte et la vitesse configurée
                        </p>
                    </div>
                </div>
            )}

            {/* ======================================== */}
            {/* OPTIONS D'AFFICHAGE */}
            {/* ======================================== */}
            <div className="mt-8">
                <DisplayOptions onOptionsChange={onDisplayOptionsChange} />
            </div>
        </div>
    );
}

// ========================================
// PROPTYPES
// ========================================

SpeedSelector.propTypes = {
    /** Callback appelé lors de la sélection d'une vitesse */
    onSpeedChange: PropTypes.func.isRequired,
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
    /** Callback pour changements d'options d'affichage (police, thème) */
    onDisplayOptionsChange: PropTypes.func.isRequired,
};

export default SpeedSelector;
