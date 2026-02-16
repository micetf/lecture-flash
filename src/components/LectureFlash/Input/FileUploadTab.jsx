/**
 * Onglet d'import de fichier texte local
 *
 * Permet à l'utilisateur de charger un fichier .txt ou .md depuis son ordinateur
 * avec validation de format et encodage UTF-8.
 *
 * VERSION 3.13.0 : Support .md avec filtrage du titre H1
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onTexteCharge - Callback appelé avec le texte chargé
 * @param {Function} props.onRetourSaisie - Callback pour revenir à l'onglet Saisir
 */

import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { validateTextFile } from "@utils/validation";
import { parseMarkdownFile } from "@services/textProcessing";

function FileUploadTab({ onTexteCharge, onRetourSaisie }) {
    const inputFichierRef = useRef(null);
    const [erreur, setErreur] = useState(null);

    const handleImportFichier = (e) => {
        const fichiers = e.target.files;

        setErreur(null);

        if (fichiers && fichiers.length > 0) {
            const fichier = fichiers[0];

            // Validation générique (taille, type texte, etc.)
            const validation = validateTextFile(fichier);
            if (!validation.valide) {
                setErreur(validation.erreur);
                e.target.value = "";
                return;
            }

            const lecteur = new FileReader();

            lecteur.onload = (event) => {
                const contenu = event.target.result || "";

                // Vérifier que le contenu n'est pas vide
                if (!contenu.trim()) {
                    setErreur("Le fichier est vide");
                    return;
                }

                const nomFichier = fichier.name.toLowerCase();
                const isMarkdown = nomFichier.endsWith(".md");

                let texteFinal = contenu;

                if (isMarkdown) {
                    // Analyse du .md : on filtre un éventuel titre H1 (# Titre)
                    const { texte } = parseMarkdownFile(contenu);
                    if (!texte.trim()) {
                        setErreur(
                            "Le fichier .md ne contient que le titre ou est vide. Aucun texte à charger."
                        );
                        return;
                    }
                    texteFinal = texte;
                }

                onTexteCharge(texteFinal);
                onRetourSaisie();
            };

            lecteur.onerror = () => {
                setErreur("Erreur lors de la lecture du fichier");
            };

            lecteur.readAsText(fichier, "UTF-8");
        }

        // Réinitialiser l'input pour permettre de recharger le même fichier
        e.target.value = "";
    };

    const handleClickBouton = () => {
        inputFichierRef.current?.click();
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">
                Importer un fichier texte (.txt / .md)
            </h3>

            <p className="text-gray-600 mb-4">
                Sélectionnez un fichier .txt ou .md depuis votre ordinateur.
                <br />
                Le texte (sans le titre éventuel en première ligne) sera
                automatiquement chargé dans l&apos;onglet &quot;Saisir&quot;.
            </p>

            {/* Input file caché */}
            <input
                type="file"
                ref={inputFichierRef}
                onChange={handleImportFichier}
                accept=".txt,.md"
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
                    <strong>Formats acceptés :</strong> .txt et .md
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    <strong>Encodage :</strong> UTF-8 (recommandé)
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    <strong>Taille maximale :</strong> 1 MB
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    Pour les fichiers <strong>.md</strong>, une première ligne
                    de la forme
                    <code> # Mon titre</code> sera traitée comme un titre et ne
                    sera pas lue pendant l&apos;exercice.
                </p>
            </div>
        </div>
    );
}

FileUploadTab.propTypes = {
    onTexteCharge: PropTypes.func.isRequired,
    onRetourSaisie: PropTypes.func.isRequired,
};

export default FileUploadTab;
