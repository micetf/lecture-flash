/**
 * Composant Modal de Partage Réutilisable
 * VERSION 3.10.0 : Composant unifié pour partage CodiMD et URL encodée
 *
 * Gère deux modes de partage :
 * - CodiMD : Partage via document CodiMD stocké (textes longs)
 * - Inline : Partage via URL encodée sans stockage (textes courts)
 *
 * Props communes :
 * - Configuration (vitesse, police, taille)
 * - Mode locked/unlocked
 * - Callbacks de génération et fermeture
 *
 * @component
 */

import React from "react";
import PropTypes from "prop-types";

/**
 * Configuration visuelle selon le type de partage
 */
const SHARE_CONFIG = {
    codimd: {
        title: "🔗 Partager avec les élèves",
        color: "blue",
        buttonClass: "bg-blue-600 hover:bg-blue-700",
        infoMessage: (
            <>
                <strong>📚 Mode avec stockage CodiMD</strong> : Le texte est
                hébergé sur un serveur externe. Idéal pour les textes longs et
                les bibliothèques de lectures.
            </>
        ),
    },
    inline: {
        title: "🔗 Partage rapide (sans stockage)",
        color: "purple",
        buttonClass: "bg-purple-600 hover:bg-purple-700",
        infoMessage: (
            <>
                <strong>💡 Mode sans stockage</strong> : Le texte est compressé
                directement dans le lien (max 2000 caractères). Aucun serveur
                externe requis. Idéal pour les textes courts et les partages
                ponctuels.
            </>
        ),
    },
};

function ShareModal({
    isOpen,
    onClose,
    type,
    vitesse,
    police,
    taille,
    texteLength,
    shareLocked,
    setShareLocked,
    onGenerateLink,
    showSuccess,
}) {
    if (!isOpen) return null;

    const config = SHARE_CONFIG[type];
    const borderColor =
        type === "codimd" ? "border-blue-200" : "border-purple-200";
    const bgColor = type === "codimd" ? "bg-blue-50" : "bg-purple-50";
    const textColor = type === "codimd" ? "text-blue-900" : "text-purple-900";

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ======================================== */}
                {/* EN-TÊTE */}
                {/* ======================================== */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                        {config.title}
                    </h3>
                    <button
                        onClick={onClose}
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

                {/* ======================================== */}
                {/* MESSAGE EXPLICATIF */}
                {/* ======================================== */}
                <div
                    className={`mb-6 p-4 ${bgColor} border ${borderColor} rounded-lg`}
                >
                    <p className={`text-sm ${textColor}`}>
                        {config.infoMessage}
                    </p>
                </div>

                {/* ======================================== */}
                {/* RÉCAPITULATIF CONFIGURATION */}
                {/* ======================================== */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                        📋 Configuration à partager :
                    </p>
                    <ul className="text-xs text-blue-800 space-y-1">
                        <li>
                            • Vitesse : <strong>{vitesse} MLM</strong>
                        </li>
                        <li>
                            • Police :{" "}
                            <strong>
                                {police === "default" ? "Défaut" : police}
                            </strong>
                        </li>
                        <li>
                            • Taille : <strong>{taille}%</strong>
                        </li>
                        {texteLength !== undefined && (
                            <li>
                                • Texte :{" "}
                                <strong>{texteLength} caractères</strong>
                            </li>
                        )}
                    </ul>
                </div>

                {/* ======================================== */}
                {/* OPTIONS DE PARTAGE */}
                {/* ======================================== */}
                <div className="space-y-4 mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name={`shareMode-${type}`}
                            checked={!shareLocked}
                            onChange={() => setShareLocked(false)}
                            className="mt-1"
                        />
                        <div>
                            <p className="font-semibold text-gray-900">
                                💡 Réglages modifiables
                            </p>
                            <p className="text-sm text-gray-600">
                                L'élève peut modifier la vitesse, la police et
                                la taille de caractères
                            </p>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name={`shareMode-${type}`}
                            checked={shareLocked}
                            onChange={() => setShareLocked(true)}
                            className="mt-1"
                        />
                        <div>
                            <p className="font-semibold text-gray-900">
                                🔒 Réglages imposés
                            </p>
                            <p className="text-sm text-gray-600">
                                La lecture démarre avec les réglages configurés
                                (vitesse, police, taille)
                            </p>
                        </div>
                    </label>
                </div>

                {/* ======================================== */}
                {/* BOUTON GÉNÉRATION */}
                {/* ======================================== */}
                <button
                    onClick={onGenerateLink}
                    disabled={!vitesse}
                    className={`w-full py-3 rounded-lg font-bold transition ${
                        vitesse
                            ? `${config.buttonClass} text-white`
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    {vitesse
                        ? "📋 Générer et copier le lien"
                        : "⚠️ Sélectionnez une vitesse d'abord"}
                </button>

                {/* ======================================== */}
                {/* MESSAGE SUCCÈS */}
                {/* ======================================== */}
                {showSuccess && (
                    <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg">
                        <p className="text-green-800 font-semibold text-center">
                            ✅ Lien copié dans le presse-papier !
                            <br />
                            <span className="text-xs">
                                Vous pouvez maintenant le coller dans votre ENT,
                                Digipad, ou l'envoyer par email.
                            </span>
                        </p>
                    </div>
                )}

                {/* ======================================== */}
                {/* HELP TEXT */}
                {/* ======================================== */}
                <p className="text-xs text-gray-500 text-center mt-4">
                    {type === "codimd"
                        ? "Le lien contiendra le texte, la vitesse configurée, ainsi que les options d'affichage (police et taille)"
                        : "Le lien contiendra le texte compressé, la vitesse, ainsi que les options d'affichage (police et taille)"}
                </p>
            </div>
        </div>
    );
}

// ========================================
// PROPTYPES
// ========================================

ShareModal.propTypes = {
    /** Contrôle l'affichage de la modale */
    isOpen: PropTypes.bool.isRequired,
    /** Callback de fermeture */
    onClose: PropTypes.func.isRequired,
    /** Type de partage */
    type: PropTypes.oneOf(["codimd", "inline"]).isRequired,

    /** Configuration - Vitesse de lecture */
    vitesse: PropTypes.number.isRequired,
    /** Configuration - Police */
    police: PropTypes.string.isRequired,
    /** Configuration - Taille en % */
    taille: PropTypes.number.isRequired,
    /** Configuration - Longueur du texte (optionnel, pour inline) */
    texteLength: PropTypes.number,

    /** Mode locked (vitesse imposée) */
    shareLocked: PropTypes.bool.isRequired,
    /** Setter pour le mode locked */
    setShareLocked: PropTypes.func.isRequired,

    /** Callback de génération du lien */
    onGenerateLink: PropTypes.func.isRequired,

    /** Affichage du message de succès */
    showSuccess: PropTypes.bool.isRequired,
};

export default ShareModal;
