/**
 * Composant Flash pour la lecture progressive du texte
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

function Flash({ texte, vitesse, switchMode }) {
    const [idMot, setIdMot] = useState(undefined);

    // Nettoyage et préparation du texte
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
    const speed =
        Math.floor(((nbreMots / vitesse) * 60000) / nbreCaracteres) - 10;

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
    };

    /**
     * Passer au mot suivant
     */
    const suivant = () => {
        idMot === nbreMots - 1 ? switchMode() : setIdMot(idMot + 1);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 my-4">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                    onClick={handleClickSwitch}
                    title="Modifier le texte ou la vitesse de lecture."
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

                {idMot === undefined && (
                    <button
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
                        onClick={handleClickStart}
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
                        Commencer la lecture à {vitesse} MLM
                    </button>
                )}
            </div>

            <p className="text-2xl leading-relaxed border-2 border-gray-300 rounded-lg p-6 bg-white">
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
    );
}

Flash.propTypes = {
    texte: PropTypes.string.isRequired,
    vitesse: PropTypes.number.isRequired,
    switchMode: PropTypes.func.isRequired,
};

export default Flash;
