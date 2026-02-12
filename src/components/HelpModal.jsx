/**
 * Composant modal d'aide contextuelle
 * Affiche un guide complet pour utiliser l'application Lecture Flash
 *
 * Conformité :
 * - WCAG 2.1 AA (navigation clavier, focus trap)
 * - ARIA role="dialog"
 * - Fermeture par Escape, par clic extérieur, ou par bouton
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - État d'ouverture de la modale
 * @param {Function} props.onClose - Callback pour fermer la modale
 *
 * @example
 * <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

function HelpModal({ isOpen, onClose }) {
    /**
     * Gère la fermeture par touche Escape
     */
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Empêcher le scroll du body quand la modale est ouverte
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-modal-title"
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* En-tête sticky */}
                <div className="sticky top-0 bg-blue-600 text-white p-6 rounded-t-lg z-10">
                    <div className="flex justify-between items-start">
                        <h2
                            id="help-modal-title"
                            className="text-2xl font-bold"
                        >
                            🎓 Guide d'utilisation - Lecture Flash
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 text-3xl leading-none transition"
                            aria-label="Fermer la fenêtre d'aide"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Contenu scrollable */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">
                    {/* Étape 1 : Ajouter votre texte */}
                    <section>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3 font-bold">
                                1
                            </span>
                            Ajouter votre texte
                        </h3>
                        <div className="ml-11 space-y-3 text-gray-700">
                            <p>Choisissez la méthode qui vous convient :</p>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">✏️</span>
                                    <div>
                                        <strong className="text-gray-900">
                                            Saisir :
                                        </strong>{" "}
                                        tapez ou collez directement votre texte
                                        dans la zone de texte
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">📄</span>
                                    <div>
                                        <strong className="text-gray-900">
                                            Fichier :
                                        </strong>{" "}
                                        importez un fichier .txt depuis votre
                                        ordinateur
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">☁️</span>
                                    <div>
                                        <strong className="text-gray-900">
                                            Cloud :
                                        </strong>{" "}
                                        chargez un texte partagé via une URL
                                        (Dropbox, Nextcloud, Google Drive...)
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Étape 2 : Choisir votre vitesse */}
                    <section>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3 font-bold">
                                2
                            </span>
                            Choisir votre vitesse de lecture
                        </h3>
                        <div className="ml-11 space-y-3 text-gray-700">
                            <p className="mb-4">
                                Sélectionnez une vitesse adaptée au niveau de
                                lecture. Les vitesses sont exprimées en{" "}
                                <strong>MLM (Mots Lus par Minute)</strong>.
                            </p>

                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    📖 Lecture à voix haute (50-150 MLM)
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <div className="bg-white p-2 rounded border border-gray-200">
                                        <div className="font-semibold">
                                            🛴 Trottinette (50 MLM)
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            CP - début CE1
                                        </div>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-gray-200">
                                        <div className="font-semibold">
                                            🛼 Roller (65 MLM)
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            CE1
                                        </div>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-gray-200">
                                        <div className="font-semibold">
                                            🚲 Vélo (80 MLM)
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            CE2
                                        </div>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-gray-200">
                                        <div className="font-semibold">
                                            🛵 Scooter (95 MLM)
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            CE2-CM1
                                        </div>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-gray-200">
                                        <div className="font-semibold">
                                            🚗 Voiture (110-120 MLM)
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            CM1-CM2
                                        </div>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-gray-200">
                                        <div className="font-semibold">
                                            🚀 Fusée (150 MLM)
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            CM2 et +
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 space-y-3 mt-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    📚 Lecture silencieuse (140-300 MLM)
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Même échelle avec vitesses doublées,
                                    adaptées à la lecture silencieuse (cycles 3
                                    et collège).
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Étape 3 : Lancer la lecture */}
                    <section>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3 font-bold">
                                3
                            </span>
                            Lancer la lecture
                        </h3>
                        <div className="ml-11 space-y-3 text-gray-700">
                            <p>
                                Une fois la vitesse sélectionnée, la lecture
                                commence automatiquement. Le texte s'affiche en
                                grand et{" "}
                                <strong>s'efface progressivement</strong> mot
                                par mot, de gauche à droite, à la vitesse
                                choisie.
                            </p>
                            <p>
                                Cette technique d'
                                <strong>effacement progressif</strong> oblige
                                l'œil à suivre le rythme et développe
                                l'automatisation de la lecture (fluence).
                            </p>
                        </div>
                    </section>

                    {/* Astuce pédagogique */}
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                        <p className="font-semibold text-amber-900 mb-2 flex items-center">
                            <span className="text-xl mr-2">💡</span>
                            Astuce pédagogique
                        </p>
                        <p className="text-sm text-amber-800">
                            <strong>Progression recommandée :</strong> Commencez
                            par une vitesse confortable où l'élève réussit à
                            lire sans stress. Puis augmentez progressivement sur
                            plusieurs séances. La répétition d'un même texte à
                            différentes vitesses est très efficace pour
                            développer l'automatisation de la lecture.
                        </p>
                    </div>

                    {/* Attribution */}
                    <div className="text-xs text-gray-500 border-t pt-4">
                        <p>
                            Outil basé sur les travaux de{" "}
                            <a
                                href="https://twitter.com/ptitejulie89"
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                @petitejulie89
                            </a>{" "}
                            - Fluence : le texte qui s'efface
                        </p>
                    </div>
                </div>

                {/* Pied de page sticky */}
                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-lg border-t">
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        J'ai compris
                    </button>
                </div>
            </div>
        </div>
    );
}

HelpModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default HelpModal;
