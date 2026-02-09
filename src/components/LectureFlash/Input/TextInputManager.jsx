/**
 * Composant unifié pour la gestion de l'entrée de texte
 * Centralise : saisie manuelle, import fichier local, chargement cloud
 *
 * @component
 * @param {Object} props
 * @param {string} props.texte - Texte actuel
 * @param {Function} props.onTexteChange - Callback de modification du texte
 * @param {Function} props.onUrlSubmit - Callback pour le chargement cloud
 * @param {boolean} [props.loading=false] - État de chargement cloud
 * @param {string} [props.error=null] - Message d'erreur cloud
 * @param {string} [props.sourceUrl=null] - URL source si chargé depuis cloud
 * @param {Function} [props.onReset=null] - Callback de réinitialisation
 * @returns {JSX.Element}
 */

import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

/**
 * Types d'onglets disponibles
 * @enum {string}
 */
const TAB_TYPES = {
    MANUAL: "manual",
    FILE: "file",
    CLOUD: "cloud",
};

/**
 * Configuration des onglets
 */
const TABS_CONFIG = [
    {
        id: TAB_TYPES.MANUAL,
        label: "Saisir",
        icon: "✏️",
        title: "Saisir ou coller du texte",
    },
    {
        id: TAB_TYPES.FILE,
        label: "Fichier",
        icon: "📄",
        title: "Importer un fichier .txt",
    },
    {
        id: TAB_TYPES.CLOUD,
        label: "Cloud",
        icon: "☁️",
        title: "Charger depuis le cloud",
    },
];

function TextInputManager({
    texte,
    onTexteChange,
    onUrlSubmit,
    loading = false,
    error = null,
    sourceUrl = null,
    onReset = null,
}) {
    // Onglet actif (par défaut : saisie manuelle)
    const [activeTab, setActiveTab] = useState(TAB_TYPES.MANUAL);

    // État pour le chargement cloud
    const [cloudUrl, setCloudUrl] = useState("");
    const [showCloudHelp, setShowCloudHelp] = useState(false);

    // Référence pour l'input file
    const fileInputRef = useRef(null);

    /**
     * Gère le changement de texte dans le textarea
     * @param {Event} e - Événement de changement
     */
    const handleTexteChange = (e) => {
        onTexteChange(e.target.value);
    };

    /**
     * Gère l'import d'un fichier .txt
     * @param {Event} e - Événement de changement de fichier
     */
    const handleFileImport = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            if (files[0].type.match("text/plain")) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    onTexteChange(event.target.result);
                    setActiveTab(TAB_TYPES.MANUAL); // Retour à l'onglet saisie
                };
                reader.onerror = () => {
                    alert("Erreur lors de la lecture du fichier.");
                };
                reader.readAsText(files[0]);
            } else {
                alert("Veuillez sélectionner un fichier .txt");
            }
        }
        // Reset l'input pour permettre de recharger le même fichier
        e.target.value = "";
    };

    /**
     * Déclenche le clic sur l'input file caché
     */
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    /**
     * Gère la soumission de l'URL cloud
     * @param {Event} e - Événement de soumission
     */
    const handleCloudSubmit = (e) => {
        e.preventDefault();
        if (cloudUrl.trim()) {
            onUrlSubmit(cloudUrl.trim());
        }
    };

    /**
     * Gère l'export du texte en fichier .txt
     */
    const handleExport = () => {
        if (!texte.trim()) {
            alert("Aucun texte à exporter.");
            return;
        }

        const element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + encodeURIComponent(texte.trim())
        );
        element.setAttribute("download", "lecture-flash.txt");
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    /**
     * Exemples d'URLs cloud pour l'aide
     */
    const cloudExamples = [
        {
            service: "Dropbox",
            exemple: "https://www.dropbox.com/s/abc123/texte.md?dl=0",
            icon: "📦",
        },
        {
            service: "Apps.education.fr",
            exemple: "https://nuage03.apps.education.fr/s/AbCd1234",
            icon: "🇫🇷",
        },
        {
            service: "Nextcloud",
            exemple: "https://nextcloud.exemple.fr/s/xyz789",
            icon: "☁️",
        },
        {
            service: "Google Drive",
            exemple: "https://drive.google.com/file/d/1a2b3c4d5/view",
            icon: "📁",
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            {/* Barre d'onglets */}
            <div className="border-b border-gray-200">
                <nav className="flex -mb-px" role="tablist">
                    {TABS_CONFIG.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex-1 px-4 py-3 text-center font-medium text-sm
                                border-b-2 transition-colors
                                ${
                                    activeTab === tab.id
                                        ? "border-blue-600 text-blue-600 bg-blue-50"
                                        : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                                }
                            `}
                            title={tab.title}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Contenu des onglets */}
            <div className="p-6">
                {/* ========================================
                    ONGLET SAISIE MANUELLE
                ======================================== */}
                {activeTab === TAB_TYPES.MANUAL && (
                    <div role="tabpanel">
                        <div className="flex justify-between items-center mb-3">
                            <label
                                htmlFor="text-input"
                                className="text-sm font-medium text-gray-700"
                            >
                                Votre texte
                                <span className="ml-2 text-xs text-gray-500">
                                    ({texte.length} caractères)
                                </span>
                            </label>

                            <button
                                onClick={handleExport}
                                disabled={!texte.trim()}
                                className="px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Enregistrer le texte en fichier .txt"
                            >
                                <span className="mr-1.5">💾</span>
                                Exporter
                            </button>
                        </div>

                        <textarea
                            id="text-input"
                            className="w-full rounded-lg border-2 border-blue-300 p-4 text-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                            rows="17"
                            value={texte}
                            onChange={handleTexteChange}
                            placeholder="Écrivez ou collez le texte ici..."
                        />

                        {sourceUrl && (
                            <div className="mt-3 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-center text-sm text-blue-800">
                                    <span className="mr-2">☁️</span>
                                    <span className="font-medium">
                                        Texte chargé depuis le cloud
                                    </span>
                                </div>
                                {onReset && (
                                    <button
                                        onClick={onReset}
                                        className="px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                                    >
                                        Réinitialiser
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ========================================
                    ONGLET IMPORT FICHIER
                ======================================== */}
                {activeTab === TAB_TYPES.FILE && (
                    <div role="tabpanel">
                        <div className="text-center py-12">
                            <div className="mb-6">
                                <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-4xl">
                                    📄
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Importer un fichier texte
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                Sélectionnez un fichier au format{" "}
                                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                    .txt
                                </code>{" "}
                                depuis votre ordinateur.
                            </p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".txt"
                                onChange={handleFileImport}
                                className="hidden"
                            />

                            <button
                                onClick={triggerFileInput}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center gap-2"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                Choisir un fichier
                            </button>

                            <p className="mt-4 text-xs text-gray-500">
                                Le contenu sera automatiquement chargé dans
                                l'onglet "Saisir"
                            </p>
                        </div>
                    </div>
                )}

                {/* ========================================
                    ONGLET CHARGEMENT CLOUD
                ======================================== */}
                {activeTab === TAB_TYPES.CLOUD && (
                    <div role="tabpanel">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Charger un texte depuis le cloud
                            </h3>
                            <button
                                onClick={() => setShowCloudHelp(!showCloudHelp)}
                                className="px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                                type="button"
                            >
                                {showCloudHelp ? "Masquer" : "Aide"}
                            </button>
                        </div>

                        {/* Aide avec exemples */}
                        {showCloudHelp && (
                            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-blue-900 mb-3">
                                    Services compatibles
                                </h4>
                                <ul className="space-y-2">
                                    {cloudExamples.map((ex, idx) => (
                                        <li
                                            key={idx}
                                            className="text-sm text-gray-700"
                                        >
                                            <span className="mr-2">
                                                {ex.icon}
                                            </span>
                                            <strong>{ex.service}</strong>
                                            <br />
                                            <code className="ml-6 text-xs bg-white px-2 py-1 rounded break-all">
                                                {ex.exemple}
                                            </code>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Formulaire de saisie URL */}
                        <form onSubmit={handleCloudSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="cloud-url"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    URL du fichier partagé
                                </label>
                                <input
                                    id="cloud-url"
                                    type="url"
                                    value={cloudUrl}
                                    onChange={(e) =>
                                        setCloudUrl(e.target.value)
                                    }
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            {/* Affichage des erreurs */}
                            {error && (
                                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                                    <strong>❌ Erreur :</strong> {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !cloudUrl.trim()}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5"
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
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Chargement...
                                    </>
                                ) : (
                                    <>
                                        <span>☁️</span>
                                        Charger le texte
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-4 text-xs text-gray-500 text-center">
                            Le texte sera automatiquement chargé dans l'onglet
                            "Saisir"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

TextInputManager.propTypes = {
    texte: PropTypes.string.isRequired,
    onTexteChange: PropTypes.func.isRequired,
    onUrlSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    sourceUrl: PropTypes.string,
    onReset: PropTypes.func,
};

export default TextInputManager;
