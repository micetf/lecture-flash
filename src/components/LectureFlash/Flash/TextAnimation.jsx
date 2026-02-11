/**
 * Enhanced Flash component with smooth pause/resume
 * SOLUTION: Static CSS class for completed words
 *
 * @component
 * @param {Object} props
 * @param {string} props.text - Text to display
 * @param {number} props.speedWpm - Reading speed (words per minute)
 * @param {Function} props.onSwitchMode - Callback to return to input mode
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import Word from "./Word";

const NON_BREAKING_SPACE = "\u00a0";
const NON_BREAKING_HYPHEN = "\u2011";

const specialsBeforeIn = /(^-|«|') +/g;
const specialsAfterIn = / +(;|:|!|\?|»|')/g;
const specialsBeforeOut = /(^-|«)/g;
const specialsAfterOut = /(;|:|!|\?|»)/g;

function TextAnimation({ text, speedWpm, onSwitchMode }) {
    const [currentWordIndex, setCurrentWordIndex] = useState(undefined);
    const [isPaused, setIsPaused] = useState(false);

    // Text preparation
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

    // Base duration per character (ms)
    const charSpeed = Math.floor(
        ((wordsCount / speedWpm) * 60000) / charactersCount
    );

    const handleClickSwitch = (e) => {
        e.preventDefault();
        onSwitchMode();
    };

    const handleClickStart = (e) => {
        e.preventDefault();
        setIsPaused(false);
        setCurrentWordIndex(0);
    };

    const handlePauseResume = () => {
        setIsPaused((prev) => !prev);
    };

    const handleNextWord = () => {
        if (isPaused) {
            return;
        }
        if (currentWordIndex === wordsCount - 1) {
            setTimeout(() => onSwitchMode(), 500);
        } else {
            setCurrentWordIndex((prev) => (prev !== undefined ? prev + 1 : 0));
        }
    };

    const progress =
        currentWordIndex !== undefined
            ? ((currentWordIndex + 1) / wordsCount) * 100
            : 0;

    // BEFORE START
    if (currentWordIndex === undefined) {
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
                        ▶ Commencer la lecture à {speedWpm} MLM
                    </button>
                </div>

                <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
                    <p className="text-2xl leading-relaxed">{purifiedText}</p>
                </div>
            </div>
        );
    }

    // DURING READING
    return (
        <div className="max-w-4xl mx-auto">
            {/* Control bar */}
            <div className="bg-white border-b border-gray-200 shadow-sm mb-4 p-4">
                <div className="flex gap-3 items-center justify-between">
                    <div className="flex gap-2 items-center">
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

                        {/* Inline pause indicator */}
                        {isPaused && (
                            <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                                ⏸ En pause
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                            {currentWordIndex + 1} / {wordsCount} mots (
                            {Math.round(progress)}%)
                        </span>
                    </div>
                </div>

                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Text with animation */}
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
                <p className="texte text-2xl leading-relaxed">
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

                        // Completed words: show directly with hidden class
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

                        // Current and future words: normal animation
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
    onSwitchMode: PropTypes.func.isRequired,
};

export default TextAnimation;
