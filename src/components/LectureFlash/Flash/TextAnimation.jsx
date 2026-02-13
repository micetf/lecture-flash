/**
 * Text Animation component for reading mode
 * VERSION 3.9.1 : CORRECTION bug Relire + fin de lecture
 *
 * @component
 * @param {Object} props
 * @param {string} props.text - Texte à afficher
 * @param {number} props.speedWpm - Vitesse en mots par minute
 * @param {boolean} [props.isStarted] - État démarrage lecture
 * @param {boolean} [props.isPaused] - État pause (géré par le parent)
 * @param {function} [props.onComplete] - Callback appelé à la fin de l'animation
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Word from "./Word";
import {
    parseTextWithLineBreaks,
    countWords,
    countCharacters,
} from "@services/textProcessing";

// ========================================
// CONSTANTS
// ========================================
const NON_BREAKING_SPACE = "\u00a0";
const NON_BREAKING_HYPHEN = "\u2011";
const specialsBeforeIn = /(^-|«|') +/g;
const specialsAfterIn = / +(;|:|!|\?|»|')/g;
const specialsBeforeOut = /(^-|«)/g;
const specialsAfterOut = /(;|:|!|\?|»)/g;

function TextAnimation({
    text,
    speedWpm,
    isStarted,
    isPaused = false,
    onComplete,
}) {
    // ========================================
    // STATE
    // ========================================
    const [currentWordIndex, setCurrentWordIndex] = useState(undefined);

    // ========================================
    // TEXT PROCESSING - PRÉSERVATION DES RETOURS LIGNE
    // ========================================
    const purifiedText = text
        .trim()
        .replace(/'/g, "'")
        .split("\n")
        .map((ligne) => ligne.trim().replace(/ +/g, " "))
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(specialsAfterIn, "$1")
        .replace(specialsBeforeIn, "$1");

    const motsAvecMetadonnees = parseTextWithLineBreaks(purifiedText);
    const wordsCount = motsAvecMetadonnees.length;
    const charactersCount = countCharacters(purifiedText);

    // ========================================
    // SPEED CALCULATION
    // ========================================
    const charSpeed = Math.floor(
        ((wordsCount / speedWpm) * 60000) / charactersCount
    );

    // ========================================
    // ANIMATION CONTROL
    // ========================================

    // EFFECT 1: Start animation when isStarted becomes true
    useEffect(() => {
        if (isStarted && currentWordIndex === undefined) {
            setCurrentWordIndex(0);
        }
    }, [isStarted, currentWordIndex]);

    // EFFECT 2: Reset when isStarted becomes false
    // 🔧 CORRECTION : Permet au bouton Relire de fonctionner
    useEffect(() => {
        if (!isStarted && currentWordIndex !== undefined) {
            setCurrentWordIndex(undefined);
        }
    }, [isStarted, currentWordIndex]);

    // EFFECT 3: Call onComplete when animation finishes
    useEffect(() => {
        if (currentWordIndex !== undefined && currentWordIndex >= wordsCount) {
            onComplete?.();
        }
    }, [currentWordIndex, wordsCount, onComplete]);

    // ========================================
    // HANDLERS
    // ========================================
    const handleNext = () => {
        if (!isPaused) {
            setCurrentWordIndex((prev) => (prev !== undefined ? prev + 1 : 0));
        }
    };

    const progress =
        currentWordIndex !== undefined
            ? ((currentWordIndex + 1) / wordsCount) * 100
            : 0;

    // ========================================
    // RENDER: BEFORE START (écran initial)
    // ========================================
    if (currentWordIndex === undefined) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
                    <p className="text-2xl leading-relaxed whitespace-pre-wrap">
                        {purifiedText}
                    </p>
                </div>
            </div>
        );
    }

    // ========================================
    // RENDER: DURING READING
    // ========================================
    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress bar */}
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={Math.round(progress)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label="Progression de la lecture"
                />
            </div>

            {/* Text display */}
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6 mt-4">
                <p className="text-2xl leading-relaxed">
                    {motsAvecMetadonnees.map((motData, index) => {
                        const { mot, finDeLigne, finDeParagraphe } = motData;

                        const cleanWord = mot
                            .replace(
                                specialsAfterOut,
                                `${NON_BREAKING_SPACE}$1`
                            )
                            .replace(
                                specialsBeforeOut,
                                `$1${NON_BREAKING_SPACE}`
                            )
                            .replace(/-/g, NON_BREAKING_HYPHEN);

                        // Mots déjà lus (cachés)
                        if (index < currentWordIndex) {
                            return (
                                <React.Fragment key={index}>
                                    <span className="mot">
                                        <span style={{ visibility: "hidden" }}>
                                            {cleanWord}
                                        </span>
                                        <span> </span>
                                    </span>
                                    {finDeLigne && !finDeParagraphe && <br />}
                                    {finDeParagraphe && (
                                        <>
                                            <br />
                                            <br />
                                        </>
                                    )}
                                </React.Fragment>
                            );
                        }

                        // Mot actuel et mots futurs
                        const wordSpeed =
                            index === currentWordIndex && !isPaused
                                ? charSpeed
                                : 0;

                        return (
                            <Word
                                key={index}
                                word={cleanWord}
                                speed={wordSpeed}
                                onNext={
                                    index === currentWordIndex
                                        ? handleNext
                                        : () => {}
                                }
                                finDeLigne={finDeLigne}
                                finDeParagraphe={finDeParagraphe}
                            />
                        );
                    })}
                </p>
            </div>
        </div>
    );
}

TextAnimation.propTypes = {
    text: PropTypes.string.isRequired,
    speedWpm: PropTypes.number.isRequired,
    isStarted: PropTypes.bool,
    isPaused: PropTypes.bool,
    onComplete: PropTypes.func,
};

TextAnimation.defaultProps = {
    isStarted: false,
    isPaused: false,
    onComplete: () => {},
};

export default TextAnimation;
