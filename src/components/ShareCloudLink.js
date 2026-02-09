import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * Composant pour générer et partager un lien vers l'application avec URL cloud
 * @param {Object} props - Props du composant
 * @param {string} props.cloudUrl - URL du fichier cloud
 */
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
            // Fallback pour les navigateurs plus anciens
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
        <div className="alert alert-success mb-4">
            <h5 className="alert-heading">✅ Texte chargé avec succès !</h5>
            <p>
                Partagez ce lien pour que vos élèves voient directement ce texte
                :
            </p>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control font-monospace small"
                    value={shareUrl}
                    readOnly
                    onClick={(e) => e.target.select()}
                />
                <button
                    className={`btn ${
                        copied ? "btn-success" : "btn-outline-success"
                    }`}
                    onClick={copyToClipboard}
                >
                    {copied ? "✓ Copié !" : "Copier"}
                </button>
            </div>
            <hr />
            <p className="mb-0 small">
                💡 <strong>Astuce :</strong> Si vous modifiez le fichier sur
                votre cloud, le lien restera valide !
            </p>
        </div>
    );
}

ShareCloudLink.propTypes = {
    cloudUrl: PropTypes.string.isRequired,
};
