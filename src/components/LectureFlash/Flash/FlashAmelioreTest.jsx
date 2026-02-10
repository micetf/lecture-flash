/**
 * Composant Flash amélioré - VERSION CORRIGÉE
 * Fix : Animation démarre correctement dès le premier mot
 *
 * @component
 * @param {Object} props
 * @param {string} props.texte - Texte à afficher
 * @param {number} props.vitesse - Vitesse de lecture (mots/minute)
 * @param {Function} props.switchMode - Callback pour revenir en mode saisie
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import Mot from "./Mot";

const ESPACE_INSECABLE = "\u00a0";
const TIRET_INSECABLE = "\u2011";

const specialsBeforeIn = /(^-|«|') +/g;
const specialsAfterIn = / +(;|:|!|\?|»|')/g;
const specialsBeforeOut = /(^-|«)/g;
const specialsAfterOut = /(;|:|!|\?|»)/g;

function FlashAmelioreTest({ texte, vitesse, switchMode }) {
    const [idMot, setIdMot] = useState(undefined);
    const [isPaused, setIsPaused] = useState(false);

    // Préparation du texte
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

    // Durée de base par caractère (ms)
    const speed = Math.floor(((nbreMots / vitesse) * 60000) / nbreCaracteres);

    const handleClickSwitch = (e) => {
        e.preventDefault();
        switchMode();
    };

    const handleClickStart = (e) => {
        e.preventDefault();
        setIsPaused(false);
        setIdMot(0);
    };

    const handlePauseResume = () => {
        setIsPaused(!isPaused);
    };

    const suivant = () => {
        if (isPaused) {
            return;
        }
        if (idMot === nbreMots - 1) {
            setTimeout(() => switchMode(), 500);
        } else {
            setIdMot((prev) => (prev !== undefined ? prev + 1 : 0));
        }
    };

    const progression =
        idMot !== undefined ? ((idMot + 1) / nbreMots) * 100 : 0;

    // AVANT DÉMARRAGE
    if (idMot === undefined) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex gap-2 my-4">
                    <button
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                        onClick={handleClickSwitch}
                    >
                        ← Modifier
                    </button>

                    <button
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg"
                        onClick={handleClickStart}
                    >
                        ▶ Commencer la lecture à {vitesse} MLM
                    </button>
                </div>

                <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
                    <p className="text-2xl leading-relaxed">{textePurify}</p>
                </div>
            </div>
        );
    }

    // PENDANT LA LECTURE
    return (
        <div className="max-w-4xl mx-auto">
            {/* Barre de contrôle */}
            <div className="bg-white border-b border-gray-200 shadow-sm mb-4 p-4">
                <div className="flex gap-3 items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            className={`px-6 py-2 rounded-lg transition font-semibold ${
                                isPaused
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-yellow-500 hover:bg-yellow-600 text-white"
                            }`}
                            onClick={handlePauseResume}
                        >
                            {isPaused ? "▶ Reprendre" : "⏸ Pause"}
                        </button>

                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            onClick={handleClickSwitch}
                        >
                            ⏹ Arrêter
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                            {idMot + 1} / {nbreMots} mots (
                            {Math.round(progression)}%)
                        </span>
                    </div>
                </div>

                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${progression}%` }}
                    />
                </div>
            </div>

            {isPaused && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-center">
                    <p className="text-yellow-800 font-medium">
                        ⏸ Lecture en pause
                    </p>
                </div>
            )}

            {/* Texte avec animation */}
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
                <p className="texte text-2xl leading-relaxed">
                    {mots.map((mot, index) => {
                        const motClean = mot
                            .replace(specialsAfterOut, `${ESPACE_INSECABLE}$1`)
                            .replace(specialsBeforeOut, `$1${ESPACE_INSECABLE}`)
                            .replace(/-/g, TIRET_INSECABLE);

                        // Durée de l'animation pour ce mot
                        const motSpeed =
                            index <= idMot && !isPaused ? speed : 0;

                        return (
                            <Mot
                                key={index}
                                mot={motClean}
                                speed={motSpeed}
                                suivant={index === idMot ? suivant : () => {}}
                            />
                        );
                    })}
                </p>
            </div>
        </div>
    );
}

FlashAmelioreTest.propTypes = {
    texte: PropTypes.string.isRequired,
    vitesse: PropTypes.number.isRequired,
    switchMode: PropTypes.func.isRequired,
};

export default FlashAmelioreTest;
