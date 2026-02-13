/**
 * Gestionnaire unifié de saisie de texte - Orchestrateur
 * VERSION 3.9.0 : Refactorisation avec sous-composants
 *
 * Modifications v3.9.0 :
 * - Décomposition en 3 sous-composants (ManualInputTab, FileUploadTab, CodiMDTab)
 * - TextInputManager devient un simple orchestrateur d'onglets
 * - Logique métier déléguée aux sous-composants
 *
 * @component
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import Tooltip from "../../Tooltip";
import ManualInputTab from "./ManualInputTab";
import FileUploadTab from "./FileUploadTab";
import CodiMDTab from "./CodiMDTab";

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
}) {
    const [activeTab, setActiveTab] = useState(TAB_TYPES.MANUAL);

    /**
     * Gestion du chargement de texte depuis un fichier
     * Callback pour FileUploadTab
     */
    const handleTexteCharge = (texteCharge) => {
        onTextChange(texteCharge);
        // Retourner à l'onglet Saisir après chargement
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
        <div className="bg-white rounded-lg shadow-lg p-6">
            {/* ======================================== */}
            {/* BARRE D'ONGLETS */}
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
            {/* CONTENU DES ONGLETS */}
            {/* ======================================== */}

            {/* Onglet Saisir */}
            {activeTab === TAB_TYPES.MANUAL && (
                <ManualInputTab
                    texte={text}
                    onTexteChange={onTextChange}
                    urlSource={sourceUrl}
                />
            )}

            {/* Onglet Fichier */}
            {activeTab === TAB_TYPES.FILE && (
                <FileUploadTab
                    onTexteCharge={handleTexteCharge}
                    onRetourSaisie={handleRetourSaisie}
                />
            )}

            {/* Onglet CodiMD */}
            {activeTab === TAB_TYPES.CODIMD && (
                <CodiMDTab
                    onUrlSubmit={onUrlSubmit}
                    chargement={loading}
                    erreur={error}
                />
            )}
        </div>
    );
}

TextInputManager.propTypes = {
    /** Texte actuel */
    text: PropTypes.string.isRequired,

    /** Callback modification texte */
    onTextChange: PropTypes.func.isRequired,

    /** Callback soumission URL CodiMD */
    onUrlSubmit: PropTypes.func.isRequired,

    /** État de chargement CodiMD */
    loading: PropTypes.bool,

    /** Message d'erreur CodiMD */
    error: PropTypes.string,

    /** URL source CodiMD (si chargé depuis cloud) */
    sourceUrl: PropTypes.string,
};

TextInputManager.defaultProps = {
    loading: false,
    error: null,
    sourceUrl: null,
};

export default TextInputManager;
