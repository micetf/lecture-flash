/**
 * Text Animation component for reading mode
 * VERSION 3.3.1 : CORRECTION - Animation fonctionnelle avec pause
 *
 * @component
 * @param {Object} props
 * @param {string} props.text - Texte à afficher
 * @param {number} props.speedWpm - Vitesse en mots par minute
 * @param {boolean} [props.isPaused] - État pause (géré par le parent)
 * @param {function} props.onSwitchMode - Callback pour revenir en mode saisie
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Word from "./Word";

// ========================================
// CONSTANTS (EXACTEMENT comme l'original qui fonctionne)
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
    // TEXT PROCESSING (EXACTEMENT comme l'original)
    // ========================================
    const purifiedText = text
        .trim()
        .replace(/'/g, "'")
        .replace(/ +/g, " ")
        .replace(/\n+/g, " ")
        .replace(specialsAfterIn, "$1")
        .replace(specialsBeforeIn, "$1");

    const words = purifiedText.split(" ");
    const wordsCount = words.length;
    const charactersCount = purifiedText.length;

    // ========================================
    // SPEED CALCULATION (EXACTEMENT comme l'original)
    // ========================================
    const charSpeed = Math.floor(
        ((wordsCount / speedWpm) * 60000) / charactersCount
    );

    // ========================================
    // EFFECT: Start animation when isStarted becomes true
    // ========================================
    useEffect(() => {
        if (isStarted && currentWordIndex === undefined) {
            setCurrentWordIndex(0);
        }
    }, [isStarted, currentWordIndex]);

    // ========================================
    // EFFECT: Reset when isStarted becomes false
    // ========================================
    useEffect(() => {
        if (!isStarted && currentWordIndex !== undefined) {
            setCurrentWordIndex(undefined);
        }
    }, [isStarted, currentWordIndex]);

    // ========================================
    // HANDLERS
    // ========================================
    const handleNextWord = () => {
        if (isPaused) {
            return;
        }

        if (currentWordIndex === wordsCount - 1) {
            setTimeout(() => {
                onComplete();
            }, 500);
        } else {
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
                    <p className="text-2xl leading-relaxed">{purifiedText}</p>
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
                    {words.map((word, index) => {
                        const cleanWord = word
                            .replace(
                                specialsAfterOut,
                                `${NON_BREAKING_SPACE}$1`
                            )
                            .replace(
                                specialsBeforeOut,
                                `$1${NON_BREAKING_SPACE}`
                            )
                            .replace(/-/g, NON_BREAKING_HYPHEN);

                        // ✅ CORRECTION : Completed words (hide them)
                        if (index < currentWordIndex) {
                            return (
                                <span key={index} className="mot">
                                    <span style={{ visibility: "hidden" }}>
                                        {cleanWord}
                                    </span>
                                    <span> </span>
                                </span>
                            );
                        }

                        // ✅ CORRECTION : Current and future words
                        // Le mot actuel reçoit une vitesse, les futurs 0
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
                                        ? handleNextWord
                                        : () => {}
                                }
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
    isStarted: PropTypes.bool.isRequired,
    isPaused: PropTypes.bool,
    onComplete: PropTypes.func.isRequired,
};

export default TextAnimation;
