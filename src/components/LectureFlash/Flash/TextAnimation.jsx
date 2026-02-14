/**
 * Text Animation component for reading mode
 * VERSION 3.9.13 : CORRECTION largeur texte max-w-6xl
 *
 * Corrections v3.9.13 (Sprint 18) :
 * - 🔧 CORRIGÉ : Largeur conteneur max-w-4xl → max-w-6xl (2 occurrences)
 * - Meilleure lisibilité sur TBI/TNI (classe entière)
 * - Cohérence avec CHANGELOG v3.9.12
 *
 * @component
 * @param {Object} props
 * @param {string} props.text - Texte à afficher
 * @param {number} props.speedWpm - Vitesse en mots par minute
 * @param {boolean} [props.isStarted] - État démarrage lecture
 * @param {boolean} [props.isPaused] - État pause (géré par le parent)
 * @param {function} [props.onComplete] - Callback appelé à la fin de l'animation
 * @param {Object} [props.optionsAffichage] - Options police et taille
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

/**
 * Map des polices vers les font-family CSS
 * ⚠️ IMPORTANT : Doit être IDENTIQUE à DisplayOptions.jsx
 */
const FONT_FAMILIES = {
    default:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    opendyslexic: '"OpenDyslexic", sans-serif',
    arial: "Arial, Helvetica, sans-serif",
    "comic-sans": '"Comic Sans MS", "Comic Sans", cursive',
};

function TextAnimation({
    text,
    speedWpm,
    isStarted,
    isPaused = false,
    onComplete,
    optionsAffichage,
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
            <div className="max-w-6xl mx-auto">
                {/* 🔧 CORRIGÉ : max-w-4xl → max-w-6xl */}
                <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
                    <p className="text-3xl leading-relaxed whitespace-pre-wrap">
                        {purifiedText}
                    </p>
                </div>
            </div>
        );
    }

    // 🆕 Calcul des styles dynamiques
    const stylesDynamiques = {
        fontFamily: FONT_FAMILIES[optionsAffichage?.police || "default"],
        fontSize: `${((optionsAffichage?.taille || 100) / 100) * 3}rem`, // Base 3rem * pourcentage
    };

    // ========================================
    // RENDER: DURING READING
    // ========================================
    return (
        <div className="max-w-6xl mx-auto">
            {/* 🔧 CORRIGÉ : max-w-4xl → max-w-6xl */}
            {/* Progress bar */}
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Texte animé */}
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6 mt-6">
                <p
                    className="text-3xl leading-relaxed whitespace-pre-wrap"
                    style={stylesDynamiques}
                >
                    {motsAvecMetadonnees.map(
                        ({ mot, finDeLigne, finDeParagraphe }, index) => {
                            const cleanWord = mot
                                .replace(/\u00a0/g, " ")
                                .replace(/\u2011/g, "-")
                                .replace(specialsBeforeOut, "$1 ")
                                .replace(specialsAfterOut, " $1");

                            const wordSpeed =
                                index <= currentWordIndex
                                    ? charSpeed * cleanWord.length
                                    : charSpeed
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
                        }
                    )}
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
    optionsAffichage: PropTypes.shape({
        police: PropTypes.oneOf([
            "default",
            "opendyslexic",
            "arial",
            "comic-sans",
        ]),
        taille: PropTypes.number,
    }),
};

TextAnimation.defaultProps = {
    isStarted: false,
    isPaused: false,
    onComplete: () => {},
    optionsAffichage: { police: "default", taille: 100 },
};

export default TextAnimation;
