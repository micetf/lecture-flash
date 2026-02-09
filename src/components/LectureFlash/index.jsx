/**
 * Composant principal de l'application Lecture Flash
 * VERSION VÉRIFIÉE - Utilise FlashAmelioreTest
 *
 * @component
 * @returns {JSX.Element}
 */

import React, { useState, useEffect } from "react";

import Input from "./Input";
import FlashAmelioreTest from "./Flash/FlashAmelioreTest"; // ← IMPORTANT : FlashAmelioreTest, pas Flash
import initialState from "./initialState";
import { mode } from "./parametres.js";

import { useMarkdownFromUrl } from "../../hooks/useMarkdownFromUrl";

function LectureFlash() {
    // ========================================
    // STATE DE L'APPLICATION
    // ========================================
    const [state, setState] = useState(initialState);

    // ========================================
    // HOOK POUR LE CHARGEMENT CLOUD
    // ========================================
    const { markdown, loading, error, sourceUrl, loadMarkdownFromUrl, reset } =
        useMarkdownFromUrl();

    // ========================================
    // EFFET : Mise à jour du texte quand markdown est chargé
    // ========================================
    useEffect(() => {
        if (markdown) {
            setState((prevState) => ({ ...prevState, texte: markdown }));
        }
    }, [markdown]);

    // ========================================
    // GESTION DES MODES
    // ========================================

    /**
     * Passe en mode lecture avec la vitesse choisie
     * @param {number} vitesse - Vitesse de lecture (mots/minute)
     */
    const switchModeLecture = (vitesse) => {
        console.log("📖 Passage en mode LECTURE avec vitesse :", vitesse); // Debug
        setState({ ...state, mode: mode.LECTURE, vitesse });
    };

    /**
     * Revient en mode saisie
     */
    const switchModeSaisie = () => {
        console.log("✏️ Retour en mode SAISIE"); // Debug
        setState({ ...state, mode: mode.SAISIE });
    };

    // ========================================
    // GESTION DU TEXTE
    // ========================================

    /**
     * Met à jour le texte
     * @param {string} texte - Nouveau texte
     */
    const changeTexte = (texte) => {
        setState({ ...state, texte });
    };

    /**
     * Réinitialise l'application (supprime texte cloud)
     */
    const handleReset = () => {
        setState(initialState);
        reset();
        window.history.pushState({}, "", window.location.pathname);
    };

    // ========================================
    // RENDU
    // ========================================

    console.log("🔍 État actuel :", state); // Debug - voir l'état complet

    return (
        <div className="container mx-auto px-4 py-6">
            {state.mode === mode.SAISIE ? (
                /* ========================================
                    MODE SAISIE : Input avec TextInputManager
                ======================================== */
                <Input
                    texte={state.texte}
                    changeTexte={changeTexte}
                    switchMode={switchModeLecture} // ← Passe la fonction
                    onUrlSubmit={loadMarkdownFromUrl}
                    loading={loading}
                    error={error}
                    sourceUrl={sourceUrl}
                    onReset={handleReset}
                />
            ) : (
                /* ========================================
                    MODE LECTURE : FlashAmelioreTest
                ======================================== */
                <FlashAmelioreTest
                    texte={state.texte}
                    vitesse={state.vitesse}
                    switchMode={switchModeSaisie}
                />
            )}
        </div>
    );
}

export default LectureFlash;
