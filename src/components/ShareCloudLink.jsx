/**
 * Composant pour générer et partager un lien vers l'application avec URL cloud
 *
 * @component
 * @param {Object} props - Props du composant
 * @param {string} props.cloudUrl - URL du fichier cloud
 * @returns {JSX.Element|null} Composant de partage ou null
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

export function ShareCloudLink({ cloudUrl }) {
    const [copied, setCopied] = useState(false);

    /**
     * Génère l'URL complète de partage
     * @returns {string} URL de partage
     */
    const generateShareUrl = () => {
        const baseUrl = window.location.origin + window.location.pathname;
        const encodedUrl = encodeURIComponent(cloudUrl);
        return `${baseUrl}?url=${encodedUrl}`;
    };

    const shareUrl = generateShareUrl();

    /**
     * Copie l'URL dans le presse-papiers
     */
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch (error) {
            console.error("Erreur lors de la copie:", error);
            fallbackCopy(shareUrl);
        }
    };

    /**
     * Méthode de secours pour copier le texte
     * @param {string} text - Texte à copier
     */
    const fallbackCopy = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand("copy");
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            console.error("Erreur lors de la copie de secours:", err);
        }

        document.body.removeChild(textArea);
    };

    if (!cloudUrl) return null;

    return (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
            <h5 className="text-lg font-semibold text-green-900 mb-2">
                ✅ Texte chargé avec succès !
            </h5>
            <p className="text-green-800 mb-3">
                Partagez ce lien pour que vos élèves voient directement ce texte
                :
            </p>

            {/* Input avec bouton de copie */}
            <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    className="flex-1 px-3 py-2 font-mono text-sm bg-white border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={shareUrl}
                    readOnly
                    onClick={(e) => e.target.select()}
                />
                <button
                    className={`px-4 py-2 rounded font-medium transition ${
                        copied
                            ? "bg-green-600 text-white"
                            : "bg-white text-green-600 border border-green-600 hover:bg-green-50"
                    }`}
                    onClick={copyToClipboard}
                >
                    {copied ? "✓ Copié !" : "Copier"}
                </button>
            </div>

            <hr className="border-green-300 my-3" />

            {/* Astuce */}
            <p className="text-sm text-green-800 mb-0">
                💡 <strong>Astuce :</strong> Si vous modifiez le fichier sur
                votre cloud, le lien restera valide !
            </p>
        </div>
    );
}

ShareCloudLink.propTypes = {
    cloudUrl: PropTypes.string.isRequired,
};
