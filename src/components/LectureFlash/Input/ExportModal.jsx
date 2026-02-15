import { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Slugifie une chaîne pour prévisualiser le nom de fichier
 * (Copie de la fonction du service pour éviter l'import)
 */
function slugify(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Modal pour l'export de texte avec choix du format
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - État d'ouverture de la modal
 * @param {Function} props.onClose - Fonction de fermeture
 * @param {Function} props.onConfirm - Fonction appelée avec (titre, format)
 */
function ExportModal({ isOpen, onClose, onConfirm }) {
    const [titre, setTitre] = useState("");
    const [format, setFormat] = useState("txt");
    const [erreur, setErreur] = useState("");

    // Réinitialise le formulaire à l'ouverture
    useEffect(() => {
        if (isOpen) {
            setTitre("");
            setFormat("txt");
            setErreur("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    /**
     * Gère la soumission du formulaire
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        const titreNettoye = titre.trim();

        // Validation
        if (!titreNettoye) {
            setErreur("Le titre est obligatoire");
            return;
        }

        if (titreNettoye.length < 3) {
            setErreur("Le titre doit contenir au moins 3 caractères");
            return;
        }

        if (titreNettoye.length > 100) {
            setErreur("Le titre ne peut pas dépasser 100 caractères");
            return;
        }

        // Appel callback avec titre et format
        onConfirm(titreNettoye, format);

        // Fermeture
        onClose();
    };

    /**
     * Gère la fermeture (Escape ou clic extérieur)
     */
    const handleClose = () => {
        setTitre("");
        setFormat("txt");
        setErreur("");
        onClose();
    };

    /**
     * Gère la touche Escape
     */
    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            handleClose();
        }
    };

    // Calcul du nom de fichier prévisualisé
    const nomFichierPreview = titre.trim()
        ? `${slugify(titre)}.${format}`
        : `exemple.${format}`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleClose}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-modal-title"
        >
            <div
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* En-tête */}
                <div className="flex items-center justify-between mb-4">
                    <h2
                        id="export-modal-title"
                        className="text-xl font-bold text-gray-800"
                    >
                        Télécharger le texte
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
                        aria-label="Fermer"
                    >
                        ×
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit}>
                    {/* Input titre */}
                    <div className="mb-4">
                        <label
                            htmlFor="export-title"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Titre du fichier{" "}
                            <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="export-title"
                            type="text"
                            value={titre}
                            onChange={(e) => {
                                setTitre(e.target.value);
                                setErreur("");
                            }}
                            placeholder="Ex: Histoire de la petite souris"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                            maxLength={100}
                        />

                        {/* Compteur de caractères */}
                        <p className="text-xs text-gray-500 mt-1">
                            {titre.length}/100 caractères
                        </p>

                        {/* Message d'erreur */}
                        {erreur && (
                            <p
                                className="text-sm text-red-600 mt-2"
                                role="alert"
                            >
                                {erreur}
                            </p>
                        )}
                    </div>

                    {/* Choix du format */}
                    <div className="mb-4">
                        <fieldset>
                            <legend className="block text-sm font-medium text-gray-700 mb-2">
                                Format d'export
                            </legend>

                            <div className="space-y-2">
                                {/* Option .txt */}
                                <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="format"
                                        value="txt"
                                        checked={format === "txt"}
                                        onChange={(e) =>
                                            setFormat(e.target.value)
                                        }
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-800">
                                            Texte brut (.txt)
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Format simple, compatible partout
                                        </div>
                                    </div>
                                </label>

                                {/* Option .md */}
                                <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="format"
                                        value="md"
                                        checked={format === "md"}
                                        onChange={(e) =>
                                            setFormat(e.target.value)
                                        }
                                        className="mt-1"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-800">
                                            Markdown (.md) - Pour CodiMD
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Le titre sera ajouté en première
                                            ligne (# Titre)
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </fieldset>
                    </div>

                    {/* Info contextuelle pour Markdown */}
                    {format === "md" && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex gap-2">
                                <span className="text-blue-600 text-lg">
                                    ℹ️
                                </span>
                                <div className="text-sm text-blue-800">
                                    <strong>Format Markdown :</strong> Le titre
                                    sera ajouté en première ligne (
                                    <code className="bg-blue-100 px-1 py-0.5 rounded text-xs">
                                        # Titre
                                    </code>
                                    ) et ne sera pas lu pendant l'animation de
                                    lecture.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Aperçu nom de fichier */}
                    <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">
                            Nom du fichier :
                        </div>
                        <div className="font-mono text-sm text-gray-800">
                            {nomFichierPreview}
                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={!titre.trim() || titre.trim().length < 3}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                            📥 Télécharger
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

ExportModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export default ExportModal;
