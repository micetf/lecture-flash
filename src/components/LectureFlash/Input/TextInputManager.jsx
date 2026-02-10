/**
 * Composant unifié pour la gestion de l'entrée de texte
 * Centralise : saisie manuelle, import fichier local, chargement CodiMD
 *
 * VERSION 3.0.0 : Restriction CodiMD only
 *
 * @component
 * @param {Object} props
 * @param {string} props.texte - Texte actuel
 * @param {Function} props.onTexteChange - Callback de modification du texte
 * @param {Function} props.onUrlSubmit - Callback pour le chargement CodiMD
 * @param {boolean} [props.loading=false] - État de chargement CodiMD
 * @param {string} [props.error=null] - Message d'erreur CodiMD
 * @param {string} [props.sourceUrl=null] - URL source si chargé depuis CodiMD
 * @param {Function} [props.onReset=null] - Callback de réinitialisation
 * @param {Object} [props.speedConfig=null] - Config vitesse depuis URL { speed: number, locked: boolean }
 * @returns {JSX.Element}
 */

import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Tooltip from "../../Tooltip";

/**
 * Types d'onglets disponibles
 * @enum {string}
 */
const TAB_TYPES = {
    MANUAL: "manual",
    FILE: "file",
    CODIMD: "codimd",
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
        id: TAB_TYPES.CODIMD,
        label: "CodiMD",
        icon: "📝",
        title: "Charger depuis CodiMD",
        tooltip:
            "Importez un document partagé depuis codimd.apps.education.fr (service RGPD Éducation nationale)",
    },
];

/**
 * Vitesses disponibles pour le partage
 */
const VITESSES_PARTAGE = [
    { value: 30, label: "30 MLM - Très lent (CP-début CE1)" },
    { value: 50, label: "50 MLM - Lent (CE1)" },
    { value: 70, label: "70 MLM - Moyen (CE2)" },
    { value: 90, label: "90 MLM - Rapide (CM1-CM2)" },
    { value: 110, label: "110 MLM - Très rapide (CM2+)" },
];

function TextInputManager({
    texte,
    onTexteChange,
    onUrlSubmit,
    loading = false,
    error = null,
    sourceUrl = null,
    onReset = null,
    speedConfig = null,
}) {
    // Onglet actif (par défaut : saisie manuelle)
    const [activeTab, setActiveTab] = useState(TAB_TYPES.MANUAL);

    // État pour l'URL CodiMD à charger
    const [codimdUrl, setCodimdUrl] = useState("");

    // État pour afficher/masquer l'aide CodiMD
    const [showCodimdHelp, setShowCodimdHelp] = useState(false);

    // Référence pour l'input file
    const fileInputRef = useRef(null);

    // États pour le partage
    const [shareSpeed, setShareSpeed] = useState(70); // Vitesse par défaut
    const [shareLocked, setShareLocked] = useState(false); // Suggérée par défaut
    const [showShareSuccess, setShowShareSuccess] = useState(false);

    /**
     * Gère l'import d'un fichier local
     * @param {Event} e - Événement de changement d'input file
     */
    const handleFileImport = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];

            if (file.type === "text/plain" || file.name.endsWith(".txt")) {
                const reader = new FileReader();

                reader.onload = (event) => {
                    onTexteChange(event.target.result);
                    setActiveTab(TAB_TYPES.MANUAL);
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
     * Gère la soumission de l'URL CodiMD
     * @param {Event} e - Événement de soumission
     */
    const handleCodimdSubmit = (e) => {
        e.preventDefault();
        if (codimdUrl.trim()) {
            onUrlSubmit(codimdUrl.trim());
            setCodimdUrl("");
        }
    };

    /**
     * Génère et copie l'URL de partage avec vitesse
     */
    const handleGenerateShareLink = async () => {
        if (!sourceUrl) {
            alert("Aucun document CodiMD chargé à partager.");
            return;
        }

        // Construction de l'URL de partage
        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();
        params.set("url", sourceUrl);
        params.set("speed", shareSpeed);
        if (shareLocked) {
            params.set("locked", "true");
        }

        const shareUrl = `${baseUrl}?${params.toString()}`;

        // Copie dans le presse-papier
        try {
            await navigator.clipboard.writeText(shareUrl);
            setShowShareSuccess(true);
            setTimeout(() => setShowShareSuccess(false), 3000);
        } catch (err) {
            // Fallback si clipboard API non disponible
            const textarea = document.createElement("textarea");
            textarea.value = shareUrl;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setShowShareSuccess(true);
            setTimeout(() => setShowShareSuccess(false), 3000);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Onglets */}
            <div className="flex border-b border-gray-300 mb-4">
                {TABS_CONFIG.map((tab) => (
                    <Tooltip key={tab.id} content={tab.tooltip} position="top">
                        <button
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
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

            {/* Contenu de l'onglet SAISIE MANUELLE */}
            {activeTab === TAB_TYPES.MANUAL && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        Saisir ou coller du texte
                    </h3>
                    <textarea
                        value={texte}
                        onChange={(e) => onTexteChange(e.target.value)}
                        placeholder="Écrivez ou collez le texte ici..."
                        rows={17}
                        className="w-full p-4 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-blue-700 resize-none text-base"
                    />
                    <div className="text-sm text-gray-600 mt-2">
                        {texte.length} caractères
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleExport}
                            disabled={!texte.trim()}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                        >
                            💾 Enregistrer (.txt)
                        </button>
                    </div>
                </div>
            )}

            {/* Contenu de l'onglet FICHIER */}
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
                        accept=".txt"
                        onChange={handleFileImport}
                        ref={fileInputRef}
                        className="hidden"
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        📂 Parcourir...
                    </button>
                </div>
            )}

            {/* Contenu de l'onglet CODIMD */}
            {activeTab === TAB_TYPES.CODIMD && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        Charger un document CodiMD
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Collez l'URL d'un document partagé depuis{" "}
                        <strong>codimd.apps.education.fr</strong>.
                        {/* Bouton d'aide pour les exemples d'URL */}
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

                    <form onSubmit={handleCodimdSubmit} className="space-y-4">
                        <input
                            type="url"
                            value={codimdUrl}
                            onChange={(e) => setCodimdUrl(e.target.value)}
                            placeholder="https://codimd.apps.education.fr/s/..."
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            disabled={loading || !codimdUrl.trim()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                        >
                            {loading
                                ? "⏳ Chargement..."
                                : "📥 Charger le document"}
                        </button>
                    </form>

                    {/* Messages d'état */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700">
                            <strong>Erreur :</strong> {error}
                        </div>
                    )}

                    {sourceUrl && !error && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-green-800">
                                        ✅ Document chargé depuis CodiMD
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1 break-all">
                                        {sourceUrl}
                                    </p>
                                </div>
                                {onReset && (
                                    <button
                                        onClick={onReset}
                                        className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                                    >
                                        ❌ Réinitialiser
                                    </button>
                                )}
                            </div>

                            {/* Section de partage */}
                            <div className="mt-4 pt-4 border-t border-green-200">
                                <h4 className="font-semibold text-green-800 mb-3">
                                    🔗 Partager ce document avec une vitesse de
                                    lecture
                                </h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    Générez un lien pour que vos élèves ouvrent
                                    directement ce document avec la vitesse de
                                    votre choix.
                                </p>

                                <div className="space-y-3">
                                    {/* Sélection de vitesse */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Vitesse de lecture :
                                        </label>
                                        <select
                                            value={shareSpeed}
                                            onChange={(e) =>
                                                setShareSpeed(
                                                    parseInt(e.target.value, 10)
                                                )
                                            }
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        >
                                            {VITESSES_PARTAGE.map((v) => (
                                                <option
                                                    key={v.value}
                                                    value={v.value}
                                                >
                                                    {v.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Choix locked/unlocked */}
                                    <div>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={shareLocked}
                                                onChange={(e) =>
                                                    setShareLocked(
                                                        e.target.checked
                                                    )
                                                }
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-gray-700">
                                                Verrouiller la vitesse (l'élève
                                                ne pourra pas la modifier)
                                            </span>
                                        </label>
                                    </div>

                                    {/* Bouton de génération */}
                                    <button
                                        onClick={handleGenerateShareLink}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                    >
                                        📋 Copier le lien de partage
                                    </button>

                                    {/* Message de succès */}
                                    {showShareSuccess && (
                                        <div className="p-3 bg-blue-50 border border-blue-300 rounded-lg text-blue-800 text-sm">
                                            ✅ Lien copié ! Vous pouvez
                                            maintenant le coller dans votre
                                            Digipad, ENT, etc.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
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
    speedConfig: PropTypes.shape({
        speed: PropTypes.number.isRequired,
        locked: PropTypes.bool.isRequired,
    }),
};

export default TextInputManager;
