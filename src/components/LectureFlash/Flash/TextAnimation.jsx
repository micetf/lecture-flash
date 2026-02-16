/**
 * Text Animation component for reading mode
 * VERSION 3.9.15 : Application options affichage dès étape 3 (avant lecture)
 *
 * Corrections v3.9.15 (Sprint 19 - VRAI) :
 * - 🔧 CORRIGÉ : Options affichage (police/taille) appliquées dès étape 3
 * - Avant : Options appliquées seulement APRÈS clic "Lancer lecture"
 * - Après : Options appliquées IMMÉDIATEMENT à l'écran d'attente
 * - stylesDynamiques calculé AVANT les renders (pas après)
 * - style={stylesDynamiques} appliqué au render "BEFORE START"
 * - Impact UX : Cohérence visuelle immédiate entre étape 2 et étape 3
 *
 * Corrections v3.9.14 (Sprint 18 BIS) :
 * - Bug vitesse Word (charSpeed * length → charSpeed)
 * - Refactoring imports (FONT_FAMILIES, getTextStyles)
 *
 * Corrections v3.9.13 (Sprint 18) :
 * - Largeur conteneur max-w-4xl → max-w-6xl (2 occurrences)
 * - Meilleure lisibilité sur TBI/TNI (classe entière)
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
    purifyTextForReading,
    cleanWordForDisplay,
} from "@services/textProcessing";
import { getTextStyles } from "@config/textStyles";
import { calculateAnimationSpeed } from "@services/speedCalculations";

function TextAnimation({
    text,
    speedWpm,
    isStarted = false,
    isPaused = false,
    onComplete = () => {},
    optionsAffichage = { police: "default", taille: 100 },
}) {
    // ========================================
    // STATE
    // ========================================
    const [currentWordIndex, setCurrentWordIndex] = useState(undefined);

    // ========================================
    // TEXT PROCESSING - PRÉSERVATION DES RETOURS LIGNE
    // ========================================
    // Même logique que précédemment, mais mutualisée dans textProcessing
    const purifiedText = purifyTextForReading(text);
    const motsAvecMetadonnees = parseTextWithLineBreaks(purifiedText);
    const wordsCount = motsAvecMetadonnees.length;
    // On reste sur la logique existante pour les caractères : longueur du texte purifié
    const charactersCount = purifiedText.length;

    // ========================================
    // SPEED CALCULATION
    // ========================================
    const charSpeed = calculateAnimationSpeed(
        wordsCount,
        speedWpm,
        charactersCount
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
    // DYNAMIC STYLES CALCULATION
    // 🔧 Sprint 19 : Calculé AVANT les renders pour application dès étape 3
    // ========================================
    const stylesDynamiques = getTextStyles(
        optionsAffichage?.police,
        optionsAffichage?.taille
    );

    // ========================================
    // RENDER: BEFORE START (écran initial - étape 3 avant lecture)
    // ========================================
    if (currentWordIndex === undefined) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
                    <p
                        className="text-3xl leading-relaxed whitespace-pre-wrap"
                        style={stylesDynamiques}
                    >
                        {purifiedText}
                    </p>
                </div>

                {/* Affichage des stats en console pour le debug vitesse */}
                {process.env.NODE_ENV !== "production" &&
                    console.debug?.("TextAnimation stats", {
                        wordsCount,
                        charactersCount,
                        speedWpm,
                        charSpeed,
                    })}
            </div>
        );
    }

    // ========================================
    // RENDER: DURING READING
    // ========================================
    return (
        <div className="max-w-6xl mx-auto">
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
                            const cleanWord = cleanWordForDisplay(mot);

                            // 🔧 CORRECTION BUG v3.9.14 : Word attend la vitesse PAR CARACTÈRE
                            // Le composant Word.jsx gère lui-même la multiplication par word.length
                            const wordSpeed =
                                index <= currentWordIndex ? charSpeed : 0;

                            return (
                                <Word
                                    key={index}
                                    word={cleanWord}
                                    speed={wordSpeed}
                                    onNext={
                                        index <= currentWordIndex
                                            ? handleNext
                                            : () => {}
                                    }
                                    finDeLigne={finDeLigne}
                                    finDeParagraphe={finDeParagraphe}
                                    isPaused={isPaused}
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

export default TextAnimation;
