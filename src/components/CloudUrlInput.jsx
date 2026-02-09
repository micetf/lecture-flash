/**
 * Composant pour saisir et valider une URL de fichier cloud
 *
 * @component
 * @param {Object} props - Props du composant
 * @param {Function} props.onUrlSubmit - Callback appelé avec l'URL valide
 * @param {boolean} [props.loading=false] - État de chargement
 * @param {string} [props.error=null] - Message d'erreur
 * @returns {JSX.Element} Formulaire de saisie d'URL cloud
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

export function CloudUrlInput({ onUrlSubmit, loading = false, error = null }) {
    const [url, setUrl] = useState("");
    const [showHelp, setShowHelp] = useState(false);

    /**
     * Gère la soumission du formulaire
     * @param {Event} e - Événement de soumission
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            onUrlSubmit(url.trim());
        }
    };

    const exemples = [
        {
            service: "Dropbox",
            exemple: "https://www.dropbox.com/s/abc123/mon-texte.md?dl=0",
            icon: "📦",
        },
        {
            service: "Apps.education.fr (Nuage)",
            exemple: "https://nuage03.apps.education.fr/s/AbCd1234",
            icon: "☁️",
        },
        {
            service: "Nextcloud",
            exemple: "https://mon-nextcloud.fr/s/xyz789",
            icon: "☁️",
        },
        {
            service: "Google Drive",
            exemple: "https://drive.google.com/file/d/1a2b3c4d5e6f/view",
            icon: "📁",
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6">
                {/* En-tête avec bouton d'aide */}
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg font-semibold text-gray-900">
                        Charger un texte depuis le cloud
                    </h5>
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className="px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                        type="button"
                    >
                        {showHelp ? "Masquer l'aide" : "Aide"}
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="cloud-url"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            URL de votre fichier Markdown (.md)
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="cloud-url"
                                type="url"
                                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${
                                    error
                                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://www.dropbox.com/s/..."
                                disabled={loading}
                            />
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                                type="submit"
                                disabled={loading || !url.trim()}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Chargement...
                                    </span>
                                ) : (
                                    "Charger"
                                )}
                            </button>
                        </div>

                        {/* Message d'aide ou d'erreur */}
                        {!error && (
                            <p className="mt-2 text-sm text-gray-500">
                                Collez le lien de partage de votre fichier .md
                                depuis Dropbox, Nextcloud, Nuage...
                            </p>
                        )}
                        {error && (
                            <p className="mt-2 text-sm text-red-600">
                                <strong>Erreur :</strong> {error}
                            </p>
                        )}
                    </div>
                </form>

                {/* Aide détaillée */}
                {showHelp && (
                    <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <h6 className="font-semibold text-blue-900 mb-3">
                            Comment obtenir le lien de partage ?
                        </h6>
                        <hr className="border-blue-200 mb-3" />

                        {/* Exemples par service */}
                        {exemples.map((item, index) => (
                            <div key={index} className="mb-3">
                                <strong className="text-blue-900">
                                    {item.icon} {item.service}
                                </strong>
                                <br />
                                <code className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-blue-200 inline-block mt-1">
                                    {item.exemple}
                                </code>
                            </div>
                        ))}

                        <hr className="border-blue-200 my-3" />

                        {/* Étapes */}
                        <h6 className="font-semibold text-blue-900 mb-2">
                            📝 Étapes :
                        </h6>
                        <ol className="text-sm text-blue-900 list-decimal list-inside space-y-1">
                            <li>
                                Créez un fichier texte avec l'extension{" "}
                                <code className="bg-white px-1 py-0.5 rounded border border-blue-200">
                                    .md
                                </code>
                            </li>
                            <li>
                                Déposez-le dans votre espace cloud (Dropbox,
                                Nuage, Nextcloud...)
                            </li>
                            <li>Créez un lien de partage public</li>
                            <li>Copiez ce lien et collez-le ci-dessus</li>
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
}

CloudUrlInput.propTypes = {
    onUrlSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
};
