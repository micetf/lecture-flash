import React, { useState, useMemo } from "react"; // 🆕 Ajout useMemo
import PropTypes from "prop-types";
import Tooltip from "../../Tooltip";
import ManualInputTab from "./ManualInputTab";
import FileUploadTab from "./FileUploadTab";
import CodiMDTab from "./CodiMDTab";
import { countCharacters, countWords } from "@services/textProcessing"; // 🆕 Import

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
}) {
    const [activeTab, setActiveTab] = useState(TAB_TYPES.MANUAL);

    // 🆕 Calcul des stats (mémoïsé pour performance)
    const charCount = useMemo(() => countCharacters(text), [text]);
    const wordCount = useMemo(() => countWords(text), [text]);

    /**
     * Gestion du chargement de texte depuis un fichier
     * Callback pour FileUploadTab
     */
    const handleTexteCharge = (texteCharge) => {
        onTextChange(texteCharge);
        setActiveTab(TAB_TYPES.MANUAL);
    };

    /**
     * Retour à l'onglet Saisir
     * Callback pour les sous-composants
     */
    const handleRetourSaisie = () => {
        setActiveTab(TAB_TYPES.MANUAL);
    };

    return (
        <div className="space-y-6">
            {/* Navigation par onglets */}
            <div className="flex gap-2 border-b border-gray-200">
                {TABS_CONFIG.map((tab) => (
                    <Tooltip key={tab.id} content={tab.tooltip}>
                        <button
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                                activeTab === tab.id
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    </Tooltip>
                ))}
            </div>

            {/* Contenu des onglets */}
            <div>
                {activeTab === TAB_TYPES.MANUAL && (
                    <ManualInputTab
                        text={text}
                        setText={onTextChange}
                        charCount={charCount}
                        wordCount={wordCount}
                        sourceUrl={sourceUrl}
                    />
                )}

                {activeTab === TAB_TYPES.FILE && (
                    <FileUploadTab
                        onTexteCharge={handleTexteCharge}
                        onRetourSaisie={handleRetourSaisie}
                    />
                )}

                {activeTab === TAB_TYPES.CODIMD && (
                    <CodiMDTab
                        onUrlSubmit={onUrlSubmit}
                        loading={loading}
                        error={error}
                        sourceUrl={sourceUrl}
                        onReset={onReset}
                        onRetourSaisie={handleRetourSaisie}
                    />
                )}
            </div>
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
};

export default TextInputManager;
