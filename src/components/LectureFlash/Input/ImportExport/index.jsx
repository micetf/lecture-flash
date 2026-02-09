/**
 * Composant pour importer/exporter des fichiers texte
 *
 * @component
 * @param {Object} props
 * @param {string} props.texte - Texte actuel
 * @param {Function} props.changeTexte - Callback de modification du texte
 */

import React, { useRef } from "react";
import PropTypes from "prop-types";

function ImportExport({ texte, changeTexte }) {
    const refInputFile = useRef(null);

    /**
     * Gère l'import d'un fichier texte
     */
    const handleClickImport = (e) => {
        e.preventDefault();
        refInputFile.current.click();
        refInputFile.current.addEventListener("change", (e) => {
            e.preventDefault();
            const files = e.target.files;
            if (files && files[0].type.match("text/plain")) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    changeTexte(event.target.result);
                };
                reader.readAsText(files[0]);
            }
        });
    };

    /**
     * Gère l'export du texte en fichier .txt
     */
    const handleClickExport = (e) => {
        e.preventDefault();
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

    return (
        <div className="flex gap-2">
            <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                title="Importer un texte enregistré sur votre ordinateur."
                onClick={handleClickImport}
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
                Importer
            </button>

            <input
                className="hidden"
                type="file"
                ref={refInputFile}
                accept=".txt"
            />

            <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                title="Enregistrer le texte ci-dessous sur votre ordinateur."
                onClick={handleClickExport}
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                </svg>
                Enregistrer
            </button>
        </div>
    );
}

ImportExport.propTypes = {
    texte: PropTypes.string.isRequired,
    changeTexte: PropTypes.func.isRequired,
};

export default ImportExport;
