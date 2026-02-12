/**
 * Gestionnaire unifié de saisie de texte
 * VERSION 3.6.0 MINIMAL FIX : Correction bug navigation SANS changement de design
 *
 * CORRECTION UNIQUE : Suppression de l'effet auto-switch bloquant
 * CONSERVÉ : Design original des onglets, textarea, boutons
 *
 * @component
 */

import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Tooltip from "../../Tooltip";

const TAB_TYPES = {
    MANUAL: "manual",
    FILE: "file",
    CODIMD: "codimd",
};

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
        id: TAB_TYPES.CODIMD,
        label: "CodiMD",
        icon: "📝",
        title: "Charger depuis CodiMD",
        tooltip: "Importez un document partagé depuis codimd.apps.education.fr",
    },
];

function TextInputManager({
    text,
    onTextChange,
    onUrlSubmit,
    loading = false,
    error = null,
    sourceUrl = null,
    onReset = null,
    speedConfig = null,
}) {
    const [activeTab, setActiveTab] = useState(TAB_TYPES.MANUAL);
    const [codimdUrl, setCodimdUrl] = useState("");
    const [showCodimdHelp, setShowCodimdHelp] = useState(false);
    const fileInputRef = useRef(null);

    /**
     * ❌ SUPPRIMÉ : Effet auto-switch bloquant
     *
     * Ancien code (BUGUÉ) :
     * useEffect(() => {
     *     if (sourceUrl && activeTab !== TAB_TYPES.MANUAL && !loading) {
     *         const timer = setTimeout(() => {
     *             setActiveTab(TAB_TYPES.MANUAL);
     *         }, 300);
     *         return () => clearTimeout(timer);
     *     }
     * }, [sourceUrl, loading, activeTab]);
     *
     * Problème : Empêchait de changer d'onglet après chargement CodiMD
     * Solution : Supprimé complètement, auto-switch géré manuellement dans les handlers
     */

    /**
     * Import d'un fichier .txt local
     */
    const handleFileImport = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];

            if (file.type === "text/plain" || file.name.endsWith(".txt")) {
                const reader = new FileReader();

                reader.onload = (event) => {
                    onTextChange(event.target.result);
                    setActiveTab(TAB_TYPES.MANUAL); // Auto-switch après import
                };

                reader.onerror = () => {
                    alert("Erreur lors de la lecture du fichier.");
                };

                reader.readAsText(file, "UTF-8");
            } else {
                alert(
                    "Format de fichier non valide. Veuillez sélectionner un fichier .txt"
                );
            }
        }

        e.target.value = "";
    };

    /**
     * Export du texte en .txt
     */
    const handleExport = () => {
        if (!text.trim()) {
            alert("Aucun texte à enregistrer.");
            return;
        }

        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
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
     * Soumission de l'URL CodiMD
     */
    const handleCodimdSubmit = (e) => {
        e.preventDefault();
        if (codimdUrl.trim()) {
            onUrlSubmit(codimdUrl.trim());
            setCodimdUrl("");
            // Auto-switch après soumission (une seule fois)
            setActiveTab(TAB_TYPES.MANUAL);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* ======================================== */}
            {/* ONGLETS - DESIGN ORIGINAL CONSERVÉ */}
            {/* ======================================== */}
            <div className="flex border-b border-gray-300 mb-6">
                {TABS_CONFIG.map((tab) => (
                    <Tooltip key={tab.id} content={tab.tooltip} position="top">
                        <button
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-4 py-3 font-medium transition-all ${
                                activeTab === tab.id
                                    ? "bg-blue-600 text-white border-b-2 border-blue-600"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            aria-label={tab.title}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    </Tooltip>
                ))}
            </div>

            {/* ======================================== */}
            {/* ONGLET : Saisir */}
            {/* ======================================== */}
            {activeTab === TAB_TYPES.MANUAL && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        Saisir ou coller du texte
                    </h3>

                    {/* Badge cloud - DESIGN ORIGINAL CONSERVÉ */}
                    {sourceUrl && (
                        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-blue-800 mb-1">
                                        ☁️ Document chargé depuis CodiMD
                                    </p>
                                    <a
                                        href={sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                                    >
                                        {sourceUrl}
                                    </a>
                                </div>
                                {onReset && (
                                    <button
                                        onClick={onReset}
                                        className="ml-4 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                                        title="Réinitialiser et revenir à la saisie manuelle"
                                    >
                                        ✕ Réinitialiser
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Textarea - DESIGN ORIGINAL CONSERVÉ */}
                    <textarea
                        value={text}
                        onChange={(e) => onTextChange(e.target.value)}
                        placeholder="Écrivez ou collez le texte ici..."
                        rows={17}
                        className="w-full p-4 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-blue-700 resize-none text-base"
                    />

                    {/* Compteur - DESIGN ORIGINAL CONSERVÉ */}
                    <div className="text-sm text-gray-600 mt-2">
                        {text.length} caractères
                    </div>

                    {/* Bouton Export - DESIGN ORIGINAL CONSERVÉ */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleExport}
                            disabled={!text.trim()}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                        >
                            💾 Enregistrer (.txt)
                        </button>
                    </div>
                </div>
            )}

            {/* ======================================== */}
            {/* ONGLET : Fichier */}
            {/* ======================================== */}
            {activeTab === TAB_TYPES.FILE && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        Importer un fichier .txt
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Sélectionnez un fichier .txt depuis votre ordinateur.
                        <br />
                        Le texte sera automatiquement chargé dans l'onglet
                        "Saisir".
                    </p>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileImport}
                        accept=".txt"
                        className="hidden"
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                        📁 Choisir un fichier
                    </button>

                    <div className="mt-4 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                        <p className="text-sm text-gray-700">
                            <strong>Formats acceptés :</strong> .txt uniquement
                        </p>
                    </div>
                </div>
            )}

            {/* ======================================== */}
            {/* ONGLET : CodiMD */}
            {/* ======================================== */}
            {activeTab === TAB_TYPES.CODIMD && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        Charger un document CodiMD
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Collez l'URL d'un document partagé depuis{" "}
                        <strong>codimd.apps.education.fr</strong>.
                        <button
                            onClick={() => setShowCodimdHelp(!showCodimdHelp)}
                            className="ml-2 text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                            {showCodimdHelp ? "Masquer" : "Voir"} des exemples
                        </button>
                    </p>

                    {showCodimdHelp && (
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                            <p className="font-semibold mb-2">
                                Exemples d'URL valides :
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>
                                    <code className="bg-white px-1 py-0.5 rounded">
                                        https://codimd.apps.education.fr/s/w1D5hjCIC
                                    </code>
                                </li>
                                <li>
                                    <code className="bg-white px-1 py-0.5 rounded">
                                        https://codimd.apps.education.fr/s/EVZXBuz6e
                                    </code>
                                </li>
                            </ul>
                            <p className="mt-3 text-gray-600">
                                CodiMD est le service de rédaction collaborative
                                Markdown officiel de l'Éducation nationale
                                (RGPD, hébergement France).
                            </p>
                        </div>
                    )}

                    {/* Formulaire - DESIGN ORIGINAL CONSERVÉ */}
                    <form onSubmit={handleCodimdSubmit}>
                        <input
                            type="url"
                            value={codimdUrl}
                            onChange={(e) => setCodimdUrl(e.target.value)}
                            placeholder="https://codimd.apps.education.fr/..."
                            className="w-full px-4 py-3 mb-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                            disabled={loading}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading || !codimdUrl.trim()}
                            className={`w-full px-6 py-4 rounded-lg font-semibold transition ${
                                loading
                                    ? "bg-gray-400 text-gray-700 cursor-wait"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        >
                            {loading
                                ? "⏳ Chargement..."
                                : "☁️ Charger le texte"}
                        </button>
                    </form>

                    {/* Message d'erreur - DESIGN ORIGINAL CONSERVÉ */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                            <p className="text-sm font-semibold text-red-800">
                                ⚠️ Erreur
                            </p>
                            <p className="text-xs text-red-700 mt-1">{error}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

TextInputManager.propTypes = {
    text: PropTypes.string.isRequired,
    onTextChange: PropTypes.func.isRequired,
    onUrlSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    sourceUrl: PropTypes.string,
    onReset: PropTypes.func,
    speedConfig: PropTypes.shape({
        speed: PropTypes.number,
        locked: PropTypes.bool,
    }),
};

export default TextInputManager;
