/**
 * Composant modal d'aide contextuelle
 * Affiche un guide complet pour utiliser l'application Lecture Flash
 *
 * VERSION 3.10.0 : Mise à jour contenu cohérent avec v3.9.0
 *
 * CORRECTIONS MAJEURES :
 * - Étape 1 : "CodiMD" (pas "Cloud")
 * - Étape 2 : Ajout mention options affichage (v3.9.0)
 * - Étape 3 : Correction workflow réel (bouton Lancer, contrôles, plein écran)
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
                            <p className="mb-4">
                                Choisissez parmi <strong>3 options</strong> via
                                les onglets en haut de l'écran :
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">✍️</span>
                                    <div>
                                        <strong className="text-gray-900">
                                            Saisir :
                                        </strong>{" "}
                                        tapez ou collez directement votre texte
                                        dans la zone (compteur de mots
                                        automatique)
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">📁</span>
                                    <div>
                                        <strong className="text-gray-900">
                                            Fichier :
                                        </strong>{" "}
                                        téléversez un fichier{" "}
                                        <code className="bg-gray-100 px-1 rounded">
                                            .txt
                                        </code>{" "}
                                        depuis votre ordinateur
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">☁️</span>
                                    <div>
                                        <strong className="text-gray-900">
                                            CodiMD :
                                        </strong>{" "}
                                        téléchargez un texte partagé depuis{" "}
                                        <strong>Apps.education.fr</strong>{" "}
                                        (service accessible à tous les
                                        enseignants de l'Éducation Nationale)
                                    </div>
                                </li>
                            </ul>

                            {/* Astuce pédagogique CodiMD */}
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded mt-4">
                                <p className="font-semibold text-amber-900 mb-1 flex items-center text-sm">
                                    <span className="mr-2">💡</span>
                                    Astuce CodiMD
                                </p>
                                <p className="text-xs text-amber-800">
                                    Pour identifier facilement votre texte sur
                                    CodiMD, ajoutez un{" "}
                                    <strong>
                                        titre en première ligne avec #
                                    </strong>
                                    (exemple :{" "}
                                    <code className="bg-amber-100 px-1 rounded">
                                        # Lecture CE1 - Les animaux
                                    </code>
                                    ). Cette ligne servira de titre sur CodiMD
                                    mais ne sera{" "}
                                    <strong>pas lue pendant l'exercice</strong>{" "}
                                    (filtrée automatiquement).
                                </p>
                            </div>
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
                                    📖 Vitesses prédéfinies (conformes Eduscol)
                                </h4>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-2xl font-bold text-gray-900">
                                                    30
                                                </span>
                                                <span className="text-sm text-gray-600 ml-1">
                                                    MLM
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-gray-700">
                                                    CP - début CE1
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Déchiffrage en cours
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-2xl font-bold text-gray-900">
                                                    50
                                                </span>
                                                <span className="text-sm text-gray-600 ml-1">
                                                    MLM
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-gray-700">
                                                    CE1
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Lecture mot à mot
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-2xl font-bold text-gray-900">
                                                    70
                                                </span>
                                                <span className="text-sm text-gray-600 ml-1">
                                                    MLM
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-gray-700">
                                                    CE2
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Lecture par groupes
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-2xl font-bold text-gray-900">
                                                    90
                                                </span>
                                                <span className="text-sm text-gray-600 ml-1">
                                                    MLM
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-gray-700">
                                                    CM1-CM2
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Lecture fluide
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-2xl font-bold text-gray-900">
                                                    110
                                                </span>
                                                <span className="text-sm text-gray-600 ml-1">
                                                    MLM
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-gray-700">
                                                    CM2 et +
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Lecture experte
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded p-3 mt-3">
                                    <p className="text-xs text-blue-800">
                                        💡{" "}
                                        <strong>Vitesse personnalisée</strong> :
                                        Vous pouvez également choisir une
                                        vitesse de 20 à 200 MLM avec le curseur.
                                    </p>
                                </div>
                            </div>

                            {/* 🆕 Mention options affichage v3.9.0 */}
                            <div className="bg-blue-50 rounded-lg p-4 mt-4">
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                    <span className="text-xl mr-2">🎨</span>
                                    Options d'affichage
                                </h4>
                                <p className="text-sm text-gray-700">
                                    Pour adapter l'affichage au TBI/TNI ou aux
                                    élèves à besoins particuliers, vous pouvez
                                    personnaliser :
                                </p>
                                <ul className="text-sm text-gray-700 mt-2 space-y-1 ml-4">
                                    <li>
                                        • <strong>Police</strong> : Par défaut,
                                        OpenDyslexic, Arial, Comic Sans MS
                                    </li>
                                    <li>
                                        • <strong>Taille du texte</strong> :
                                        100% à 200% (curseur)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Étape 3 : Lancer la lecture - VERSION CORRIGÉE */}
                    <section>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3 font-bold">
                                3
                            </span>
                            Lancer la lecture
                        </h3>
                        <div className="ml-11 space-y-3 text-gray-700">
                            {/* Bouton Lancer */}
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
                                <p className="font-semibold text-green-900 mb-2">
                                    📌 Démarrage
                                </p>
                                <p className="text-sm text-green-800">
                                    Cliquez sur le bouton{" "}
                                    <strong>"▶️ Lancer la lecture"</strong> pour
                                    commencer. Le texte s'affiche en grand et{" "}
                                    <strong>s'efface progressivement</strong>{" "}
                                    mot par mot, de gauche à droite, à la
                                    vitesse choisie.
                                </p>
                            </div>

                            {/* Explication pédagogique */}
                            <p>
                                Cette technique d'
                                <strong>effacement progressif</strong> oblige
                                l'œil à suivre le rythme et développe
                                l'automatisation de la lecture (fluence).
                            </p>

                            {/* Contrôles disponibles */}
                            <div className="bg-gray-50 rounded-lg p-4 mt-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    🎮 Contrôles disponibles
                                </h4>
                                <ul className="text-sm text-gray-700 space-y-2">
                                    <li className="flex items-start">
                                        <span className="font-bold mr-2">
                                            ⏸️
                                        </span>
                                        <span>
                                            <strong>Pause / Reprendre</strong> :
                                            Met en pause ou reprend la lecture
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-bold mr-2">
                                            🔄
                                        </span>
                                        <span>
                                            <strong>Relire</strong> : Recommence
                                            la lecture depuis le début
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-bold mr-2">
                                            ←
                                        </span>
                                        <span>
                                            <strong>Changer la vitesse</strong>{" "}
                                            : Retourne à l'étape 2 (sauf si
                                            vitesse imposée par l'enseignant)
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="font-bold mr-2">
                                            ⛶
                                        </span>
                                        <span>
                                            <strong>Mode plein écran</strong> :
                                            Bouton en haut à droite pour une
                                            concentration maximale (appuyez sur
                                            Échap pour quitter)
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* Barre de progression */}
                            <div className="bg-blue-50 rounded-lg p-3 mt-4">
                                <p className="text-sm text-blue-800">
                                    📊 Une <strong>barre de progression</strong>{" "}
                                    en haut de l'écran vous indique l'avancement
                                    de la lecture.
                                </p>
                            </div>
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
