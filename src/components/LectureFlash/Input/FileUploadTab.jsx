/**
 * Onglet d'import de fichier texte local
 *
 * Permet à l'utilisateur de charger un fichier .txt depuis son ordinateur
 * avec validation de format et encodage UTF-8
 *
 * VERSION 3.9.0 : Extraction depuis TextInputManager
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onTexteCharge - Callback appelé avec le texte chargé
 * @param {Function} props.onRetourSaisie - Callback pour revenir à l'onglet Saisir
 */

import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { validateTextFile } from "@utils/validation";

function FileUploadTab({ onTexteCharge, onRetourSaisie }) {
    const inputFichierRef = useRef(null);
    const [erreur, setErreur] = useState(null);

    /**
     * Gestion de l'import de fichier .txt
     * Valide le fichier puis lit son contenu en UTF-8
     */
    const handleImportFichier = (e) => {
        const fichiers = e.target.files;

        // Réinitialiser l'erreur
        setErreur(null);

        if (fichiers && fichiers.length > 0) {
            const fichier = fichiers[0];

            // Validation du fichier
            const validation = validateTextFile(fichier);

            if (!validation.valide) {
                setErreur(validation.erreur);
                e.target.value = ""; // Réinitialiser l'input
                return;
            }

            // Lecture du fichier
            const lecteur = new FileReader();

            lecteur.onload = (event) => {
                const contenu = event.target.result;

                // Vérifier que le contenu n'est pas vide
                if (!contenu || contenu.trim() === "") {
                    setErreur("Le fichier est vide");
                    return;
                }

                // Passer le texte au parent et revenir à l'onglet Saisir
                onTexteCharge(contenu);
                onRetourSaisie();
            };

            lecteur.onerror = () => {
                setErreur("Erreur lors de la lecture du fichier");
            };

            // Lire le fichier en UTF-8
            lecteur.readAsText(fichier, "UTF-8");
        }

        // Réinitialiser l'input pour permettre de recharger le même fichier
        e.target.value = "";
    };

    /**
     * Déclenche le clic sur l'input file caché
     */
    const handleClickBouton = () => {
        inputFichierRef.current?.click();
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">
                Importer un fichier .txt
            </h3>

            <p className="text-gray-600 mb-4">
                Sélectionnez un fichier .txt depuis votre ordinateur.
                <br />
                Le texte sera automatiquement chargé dans l'onglet "Saisir".
            </p>

            {/* Input file caché */}
            <input
                type="file"
                ref={inputFichierRef}
                onChange={handleImportFichier}
                accept=".txt"
                className="hidden"
                aria-label="Sélectionner un fichier texte"
            />

            {/* Bouton visible pour déclencher l'input */}
            <button
                onClick={handleClickBouton}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300"
                aria-label="Choisir un fichier texte"
            >
                📁 Choisir un fichier
            </button>

            {/* Message d'erreur */}
            {erreur && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-sm font-semibold text-red-800">
                        ⚠️ Erreur
                    </p>
                    <p className="text-xs text-red-700 mt-1">{erreur}</p>
                </div>
            )}

            {/* Informations sur les formats acceptés */}
            <div className="mt-4 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-700">
                    <strong>Format accepté :</strong> .txt uniquement
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    <strong>Encodage :</strong> UTF-8 (recommandé)
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    <strong>Taille maximale :</strong> 1 MB
                </p>
            </div>
        </div>
    );
}

FileUploadTab.propTypes = {
    /** Callback appelé avec le texte chargé depuis le fichier */
    onTexteCharge: PropTypes.func.isRequired,

    /** Callback pour revenir à l'onglet Saisir après chargement */
    onRetourSaisie: PropTypes.func.isRequired,
};

export default FileUploadTab;
