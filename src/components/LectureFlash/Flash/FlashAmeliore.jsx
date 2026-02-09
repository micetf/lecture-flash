/**
 * Composant Flash amélioré pour la lecture progressive du texte
 *
 * Améliorations UX/UI :
 * - Bouton pause/lecture
 * - Curseur de progression visuel
 * - Options de typographie (taille, police)
 * - CONSERVATION de l'animation originale fonctionnelle
 *
 * @component
 * @param {Object} props
 * @param {string} props.texte - Texte à afficher
 * @param {number} props.vitesse - Vitesse de lecture (mots/minute)
 * @param {Function} props.switchMode - Callback pour revenir en mode saisie
 */

import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Mot from "./Mot"; // ← Réutilisation du composant Mot original qui fonctionne

const ESPACE_INSECABLE = "\u00a0";
const TIRET_INSECABLE = "\u2011";

const specialsBeforeIn = /(^-|«|') +/g;
const specialsAfterIn = / +(;|:|!|\?|»|')/g;
const specialsBeforeOut = /(^-|«)/g;
const specialsAfterOut = /(;|:|!|\?|»)/g;

/**
 * Options de police selon recherches en lisibilité
 */
const FONT_OPTIONS = [
    {
        value: "font-sans",
        label: "Sans-serif",
        family: "system-ui, sans-serif",
    },
    {
        value: "font-mono",
        label: "Monospace",
        family: "ui-monospace, monospace",
    },
    {
        value: "comic-sans",
        label: "Comic Sans",
        family: "'Comic Sans MS', cursive",
    },
    {
        value: "opendyslexic",
        label: "OpenDyslexic",
        family: "'OpenDyslexic', sans-serif",
    },
];

const FONT_SIZES = [
    { value: "text-2xl", label: "Normal", size: "1.5rem" },
    { value: "text-3xl", label: "Grand", size: "1.875rem" },
    { value: "text-4xl", label: "Très grand", size: "2.25rem" },
    { value: "text-5xl", label: "Énorme", size: "3rem" },
];

function FlashAmeliore({ texte, vitesse, switchMode }) {
    // ========================================
    // STATE
    // ========================================
    const [idMot, setIdMot] = useState(undefined); // undefined = non démarré, number = en cours
    const [isPaused, setIsPaused] = useState(false);
    const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].value);
    const [selectedSize, setSelectedSize] = useState(FONT_SIZES[0].value);
    const [showSettings, setShowSettings] = useState(false);

    // Refs pour gérer la pause
    const pauseStartTimeRef = useRef(null);
    const currentAnimationsRef = useRef([]);

    // ========================================
    // PRÉPARATION DU TEXTE (identique à l'original)
    // ========================================
    const textePurify = texte
        .trim()
        .replace(/'/g, "'")
        .replace(/ +/g, " ")
        .replace(/\n+/g, " ")
        .replace(specialsAfterIn, "$1")
        .replace(specialsBeforeIn, "$1");

    const mots = textePurify.split(" ");
    const nbreMots = mots.length;
    const nbreCaracteres = textePurify.length;

    // Calcul du temps par caractère (ms) - FORMULE ORIGINALE
    const speed =
        Math.floor(((nbreMots / vitesse) * 60000) / nbreCaracteres) - 10;

    // ========================================
    // GESTION PAUSE/REPRENDRE
    // ========================================
    useEffect(() => {
        if (isPaused) {
            // Mettre en pause toutes les animations en cours
            const allMasques = document.querySelectorAll(".masque");
            allMasques.forEach((masque) => {
                masque.style.animationPlayState = "paused";
            });
            pauseStartTimeRef.current = Date.now();
        } else if (pauseStartTimeRef.current !== null) {
            // Reprendre les animations
            const allMasques = document.querySelectorAll(".masque");
            allMasques.forEach((masque) => {
                masque.style.animationPlayState = "running";
            });
            pauseStartTimeRef.current = null;
        }
    }, [isPaused]);

    // ========================================
    // HANDLERS
    // ========================================

    /**
     * Revenir en mode saisie
     */
    const handleClickSwitch = (e) => {
        e.preventDefault();
        switchMode();
    };

    /**
     * Démarrer la lecture
     */
    const handleClickStart = (e) => {
        e.preventDefault();
        setIdMot(0);
        setIsPaused(false);
    };

    /**
     * Pause/Reprendre la lecture
     */
    const handlePauseResume = () => {
        setIsPaused(!isPaused);
    };

    /**
     * Passer au mot suivant (callback pour le composant Mot)
     */
    const suivant = () => {
        if (idMot === nbreMots - 1) {
            // Fin de la lecture
            setTimeout(() => {
                switchMode();
            }, 500);
        } else {
            setIdMot(idMot + 1);
        }
    };

    /**
     * Calcul de la progression en pourcentage
     */
    const progression =
        idMot !== undefined ? ((idMot + 1) / nbreMots) * 100 : 0;

    // ========================================
    // RENDU AVANT DÉMARRAGE
    // ========================================
    if (idMot === undefined) {
        return (
            <div className="max-w-4xl mx-auto">
                {/* Barre d'actions */}
                <div className="flex flex-wrap gap-3 my-4 items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium flex items-center gap-2"
                            onClick={handleClickSwitch}
                            title="Revenir à la saisie du texte"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                            Modifier
                        </button>

                        <button
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium flex items-center gap-2"
                            onClick={() => setShowSettings(!showSettings)}
                            title="Options d'affichage"
                        >
                            ⚙️ Affichage
                        </button>
                    </div>

                    <div className="flex gap-2 items-center">
                        <span className="text-sm font-medium text-gray-700">
                            Vitesse : {vitesse} mots/min
                        </span>
                        <button
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg flex items-center gap-2"
                            onClick={handleClickStart}
                            title="Démarrer la lecture flash"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Commencer la lecture
                        </button>
                    </div>
                </div>

                {/* Panneau des paramètres */}
                {showSettings && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-gray-900 mb-3">
                            Options d'affichage
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Choix de la police */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Police de caractères
                                </label>
                                <div className="space-y-2">
                                    {FONT_OPTIONS.map((font) => (
                                        <button
                                            key={font.value}
                                            onClick={() =>
                                                setSelectedFont(font.value)
                                            }
                                            className={`w-full px-3 py-2 text-left rounded border transition ${
                                                selectedFont === font.value
                                                    ? "border-blue-500 bg-blue-50 font-semibold"
                                                    : "border-gray-300 hover:border-gray-400"
                                            }`}
                                            style={{ fontFamily: font.family }}
                                        >
                                            {font.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Choix de la taille */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Taille du texte
                                </label>
                                <div className="space-y-2">
                                    {FONT_SIZES.map((size) => (
                                        <button
                                            key={size.value}
                                            onClick={() =>
                                                setSelectedSize(size.value)
                                            }
                                            className={`w-full px-3 py-2 text-left rounded border transition ${
                                                selectedSize === size.value
                                                    ? "border-blue-500 bg-blue-50 font-semibold"
                                                    : "border-gray-300 hover:border-gray-400"
                                            }`}
                                        >
                                            <span
                                                style={{ fontSize: size.size }}
                                            >
                                                {size.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Aperçu du texte */}
                <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
                    <p
                        className={`leading-relaxed ${selectedSize} ${
                            selectedFont === "comic-sans"
                                ? "font-['Comic_Sans_MS']"
                                : selectedFont === "opendyslexic"
                                  ? "font-['OpenDyslexic']"
                                  : selectedFont
                        }`}
                    >
                        {textePurify}
                    </p>
                </div>

                {/* Informations */}
                <div className="mt-4 text-sm text-gray-600 text-center">
                    📝 {nbreMots} mots • ⏱️ Durée estimée :{" "}
                    {Math.ceil((nbreMots / vitesse) * 60)} secondes
                </div>
            </div>
        );
    }

    // ========================================
    // RENDU PENDANT LA LECTURE
    // ========================================
    return (
        <div className="max-w-4xl mx-auto">
            {/* Barre de contrôle sticky */}
            <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm mb-4 p-4 z-10">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    {/* Boutons de contrôle */}
                    <div className="flex gap-2">
                        <button
                            className={`px-6 py-2 rounded-lg transition font-semibold text-lg ${
                                isPaused
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-yellow-500 hover:bg-yellow-600 text-white"
                            }`}
                            onClick={handlePauseResume}
                            title={
                                isPaused
                                    ? "Reprendre la lecture"
                                    : "Mettre en pause"
                            }
                        >
                            {isPaused ? "▶ Reprendre" : "⏸ Pause"}
                        </button>

                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                            onClick={handleClickSwitch}
                            title="Arrêter et revenir à la saisie"
                        >
                            ⏹ Arrêter
                        </button>
                    </div>

                    {/* Informations de progression */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                            {idMot + 1} / {nbreMots} mots
                        </span>
                        <span className="text-sm text-gray-500">
                            ({Math.round(progression)}%)
                        </span>
                    </div>
                </div>

                {/* Barre de progression visuelle */}
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300 ease-linear"
                        style={{ width: `${progression}%` }}
                    />
                </div>
            </div>

            {/* Message de pause */}
            {isPaused && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-center">
                    <p className="text-yellow-800 font-medium">
                        ⏸ Lecture en pause
                    </p>
                </div>
            )}

            {/* Zone de texte avec animation - UTILISE LE COMPOSANT MOT ORIGINAL */}
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
                <p
                    className={`leading-relaxed ${selectedSize} ${
                        selectedFont === "comic-sans"
                            ? "font-['Comic_Sans_MS']"
                            : selectedFont === "opendyslexic"
                              ? "font-['OpenDyslexic']"
                              : selectedFont
                    }`}
                >
                    {mots.map((mot, index) => {
                        const motClean = mot
                            .replace(specialsAfterOut, `${ESPACE_INSECABLE}$1`)
                            .replace(specialsBeforeOut, `$1${ESPACE_INSECABLE}`)
                            .replace(/-/g, TIRET_INSECABLE);

                        return (
                            <Mot
                                key={index}
                                mot={motClean}
                                speed={
                                    idMot !== undefined && idMot >= index
                                        ? speed
                                        : 0
                                }
                                suivant={suivant}
                            />
                        );
                    })}
                </p>
            </div>
        </div>
    );
}

FlashAmeliore.propTypes = {
    texte: PropTypes.string.isRequired,
    vitesse: PropTypes.number.isRequired,
    switchMode: PropTypes.func.isRequired,
};

export default FlashAmeliore;
