/**
 * Onglet de saisie manuelle de texte
 *
 * Permet à l'utilisateur de taper ou coller du texte directement
 * avec compteur en temps réel et export .txt
 *
 * VERSION 3.9.0 : Extraction depuis TextInputManager
 *
 * @component
 * @param {Object} props
 * @param {string} props.texte - Texte actuel
 * @param {Function} props.onTexteChange - Callback modification texte
 * @param {string} [props.urlSource] - URL CodiMD source (si chargé depuis cloud)
 */

import React from "react";
import PropTypes from "prop-types";
import { countWords } from "@services/textProcessing";

function ManualInputTab({ texte, onTexteChange, urlSource }) {
    /**
     * Export du texte en fichier .txt
     * Nom de fichier : lecture-flash-{timestamp}.txt
     */
    const handleExport = () => {
        if (!texte.trim()) {
            alert("Aucun texte à enregistrer.");
            return;
        }

        const blob = new Blob([texte], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const lien = document.createElement("a");

        lien.href = url;
        lien.download = `lecture-flash-${Date.now()}.txt`;

        document.body.appendChild(lien);
        lien.click();
        document.body.removeChild(lien);

        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">
                Saisir ou coller du texte
            </h3>

            {/* Badge cloud - Affiché si texte chargé depuis CodiMD */}
            {urlSource && (
                <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                    <div className="flex items-start">
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-blue-800 mb-1">
                                ☁️ Document chargé depuis CodiMD
                            </p>
                            <a
                                href={urlSource}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                            >
                                {urlSource}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Zone de texte principale */}
            <textarea
                value={texte}
                onChange={(e) => onTexteChange(e.target.value)}
                placeholder="Écrivez ou collez le texte ici..."
                rows={17}
                className="w-full p-4 border-2 border-blue-500 rounded-lg focus:outline-none focus:border-blue-700 resize-none text-base"
                aria-label="Zone de saisie de texte"
            />

            {/* Compteur caractères + mots */}
            <div className="text-sm text-gray-600 mt-2">
                {texte.length} caractères • {countWords(texte)} mots
            </div>

            {/* Bouton Export */}
            <div className="flex gap-2 mt-4">
                <button
                    onClick={handleExport}
                    disabled={!texte.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                    aria-label="Enregistrer le texte au format .txt"
                >
                    💾 Enregistrer (.txt)
                </button>
            </div>
        </div>
    );
}

ManualInputTab.propTypes = {
    /** Texte actuel dans la zone de saisie */
    texte: PropTypes.string.isRequired,

    /** Callback appelé lors de la modification du texte */
    onTexteChange: PropTypes.func.isRequired,

    /** URL source CodiMD (si texte chargé depuis le cloud) */
    urlSource: PropTypes.string,
};

ManualInputTab.defaultProps = {
    urlSource: null,
};

export default ManualInputTab;
