/**
 * Composant unifié pour la gestion de l'entrée de texte
 * Centralise : saisie manuelle, import fichier local, chargement cloud
 *
 * VERSION AVEC TOOLTIPS : Ajout de tooltips contextuels sur les onglets
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
import Tooltip from "../../Tooltip"; // ← Chemin relatif depuis Input/ vers components/Tooltip/

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
 * Configuration des onglets avec tooltips
 */
const TABS_CONFIG = [
    {
        id: TAB_TYPES.MANUAL,
        label: "Saisir",
        icon: "✏️",
        title: "Saisir ou coller du texte",
        tooltip:
            "Tapez ou collez votre texte directement dans la zone de texte",
    },
    {
        id: TAB_TYPES.FILE,
        label: "Fichier",
        icon: "📄",
        title: "Importer un fichier .txt",
        tooltip: "Chargez un fichier texte (.txt) depuis votre ordinateur",
    },
    {
        id: TAB_TYPES.CLOUD,
        label: "Cloud",
        icon: "☁️",
        title: "Charger depuis le cloud",
        tooltip:
            "Importez un texte partagé via une URL cloud (Dropbox, Nextcloud...)",
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
                reader.readAsText(files[0], "UTF-8");
            } else {
                alert(
                    "Format de fichier non valide. Veuillez sélectionner un fichier .txt"
                );
            }
        }
        // Reset input pour permettre de recharger le même fichier
        e.target.value = "";
    };

    /**
     * Gère l'export du texte en fichier .txt
     */
    const handleExport = () => {
        if (!texte.trim()) {
            alert("Aucun texte à enregistrer.");
            return;
        }

        const blob = new Blob([texte], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `lecture-flash-${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    /**
     * Gère la soumission de l'URL cloud
     * @param {Event} e - Événement de soumission
     */
    const handleCloudSubmit = (e) => {
        e.preventDefault();
        if (cloudUrl.trim()) {
            onUrlSubmit(cloudUrl.trim());
            setCloudUrl("");
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Barre d'onglets avec tooltips */}
            <div className="border-b border-gray-200">
                <nav className="flex" role="tablist">
                    {TABS_CONFIG.map((tab) => (
                        <Tooltip
                            key={tab.id}
                            content={tab.tooltip}
                            position="top"
                        >
                            <button
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex-1 px-6 py-4 text-sm font-medium transition
                                    border-b-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500
                                    ${
                                        activeTab === tab.id
                                            ? "border-blue-600 text-blue-600 bg-blue-50"
                                            : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                                    }
                                `}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                aria-label={tab.tooltip}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        </Tooltip>
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
                                className={`
                                    px-3 py-1 text-sm font-medium border rounded transition
                                    ${
                                        texte.trim()
                                            ? "text-gray-700 border-gray-300 hover:bg-gray-50"
                                            : "text-gray-400 border-gray-200 cursor-not-allowed"
                                    }
                                `}
                                title="Enregistrer le texte au format .txt"
                            >
                                💾 Enregistrer
                            </button>
                        </div>

                        <textarea
                            id="text-input"
                            value={texte}
                            onChange={handleTexteChange}
                            placeholder="Collez ou tapez votre texte ici..."
                            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                            spellCheck="false"
                        />

                        {/* Badge indicateur de texte chargé depuis cloud */}
                        {sourceUrl && (
                            <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <p className="text-sm text-blue-800 font-medium mb-1">
                                            ☁️ Texte chargé depuis le cloud
                                        </p>
                                        <p className="text-xs text-blue-600 break-all">
                                            {sourceUrl}
                                        </p>
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
                                accept=".txt,text/plain"
                                onChange={handleFileImport}
                                className="hidden"
                                aria-label="Sélectionner un fichier texte"
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                <span>📁</span>
                                Choisir un fichier
                            </button>

                            <p className="mt-4 text-xs text-gray-500">
                                Le texte sera automatiquement chargé dans
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
                        <div className="max-w-xl mx-auto">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Charger depuis le cloud
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Collez l'URL d'un fichier texte partagé depuis
                                Dropbox, Nextcloud, Google Drive, etc.
                            </p>

                            {/* Bouton d'aide pour les exemples d'URL */}
                            <button
                                onClick={() => setShowCloudHelp(!showCloudHelp)}
                                className="mb-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                {showCloudHelp ? "▼" : "▶"} Voir des exemples
                                d'URL
                            </button>

                            {showCloudHelp && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-700 space-y-2">
                                    <p className="font-semibold">
                                        Exemples d'URL valides :
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>
                                            Dropbox :
                                            https://www.dropbox.com/s/...
                                        </li>
                                        <li>
                                            Nextcloud :
                                            https://cloud.example.com/s/...
                                        </li>
                                        <li>
                                            Google Drive :
                                            https://drive.google.com/file/d/...
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {/* Formulaire de saisie d'URL */}
                            <form onSubmit={handleCloudSubmit}>
                                <input
                                    type="url"
                                    value={cloudUrl}
                                    onChange={(e) =>
                                        setCloudUrl(e.target.value)
                                    }
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                                    disabled={loading}
                                    required
                                />

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                                        ⚠️ {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !cloudUrl.trim()}
                                    className={`
                                        w-full py-3 px-6 rounded-lg font-medium transition
                                        flex items-center justify-center gap-2
                                        ${
                                            loading || !cloudUrl.trim()
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                        }
                                    `}
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
                                Le texte sera automatiquement chargé dans
                                l'onglet "Saisir"
                            </p>
                        </div>
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
