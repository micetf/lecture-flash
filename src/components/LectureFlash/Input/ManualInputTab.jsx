import { useState } from "react";
import PropTypes from "prop-types";
import {
    countCharacters,
    countWords,
    exportText,
    exportMarkdown,
} from "@services/textProcessing";
import Tooltip from "@components/Tooltip";
import ExportModal from "./ExportModal"; // 🆕 Ajout

/**
 * Onglet de saisie manuelle de texte
 */
function ManualInputTab({
    text,
    setText,
    charCount,
    wordCount,
    sourceUrl = null,
}) {
    // 🆕 État pour la modal d'export
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);
    };

    const handleClear = () => {
        if (
            window.confirm("Êtes-vous sûr de vouloir effacer tout le texte ?")
        ) {
            setText("");
        }
    };

    // 🆕 Handler pour ouvrir la modal d'export
    const handleOpenExportModal = () => {
        if (!text.trim()) {
            alert("Le texte est vide. Rien à télécharger.");
            return;
        }
        setIsExportModalOpen(true);
    };

    // 🆕 Handler pour confirmer l'export
    const handleConfirmExport = (titre, format) => {
        if (format === "md") {
            exportMarkdown(titre, text);
        } else {
            exportText(titre, text);
        }
    };

    return (
        <div className="space-y-4">
            {/* 🆕 Bandeau info CodiMD */}
            {sourceUrl && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-blue-600 text-lg">
                                    ℹ️
                                </span>
                                <h3 className="font-medium text-blue-900">
                                    Texte chargé depuis CodiMD
                                </h3>
                            </div>
                            <p className="text-sm text-blue-800 mb-2">
                                Ce texte provient de CodiMD et peut être partagé
                                via un lien tant qu'il n'est pas modifié
                                localement.
                            </p>
                            <p className="text-xs text-blue-700 font-mono break-all">
                                {sourceUrl}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {/* Zone de texte */}
            <div>
                <label htmlFor="manual-text-input" className="sr-only">
                    Saisissez votre texte
                </label>
                <textarea
                    id="manual-text-input"
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Saisissez ou collez votre texte ici..."
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    aria-describedby="text-stats"
                />
            </div>

            {/* Statistiques */}
            <div id="text-stats" className="flex gap-4 text-sm text-gray-600">
                <span>
                    <strong>{charCount}</strong> caractères
                </span>
                <span>
                    <strong>{wordCount}</strong> mots
                </span>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-wrap gap-3">
                {/* 🆕 Bouton unique de téléchargement */}
                <Tooltip content="Enregistrer le texte sur votre ordinateur (.txt ou .md)">
                    <button
                        onClick={handleOpenExportModal}
                        disabled={!text.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                        📥 Télécharger
                    </button>
                </Tooltip>

                {/* Effacer */}
                <Tooltip content="Supprimer tout le texte saisi">
                    <button
                        onClick={handleClear}
                        disabled={!text.trim()}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                        Effacer
                    </button>
                </Tooltip>
            </div>

            {/* 🆕 Modal d'export */}
            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onConfirm={handleConfirmExport}
            />
        </div>
    );
}

ManualInputTab.propTypes = {
    text: PropTypes.string.isRequired,
    setText: PropTypes.func.isRequired,
    charCount: PropTypes.number.isRequired,
    wordCount: PropTypes.number.isRequired,
    sourceUrl: PropTypes.string,
};

export default ManualInputTab;
