/**
 * Composant principal de l'application Lecture Flash
 * VERSION 3.0.0 : Solution hybride avec optimisation locked=true
 *
 * @component
 * @returns {JSX.Element}
 */

import React, { useState, useEffect } from "react";
import Input from "./Input";
import FlashAmelioreTest from "./Flash/FlashAmelioreTest";
import initialState from "./initialState";
import { mode } from "./parametres.js";
import { useMarkdownFromUrl } from "../../hooks/useMarkdownFromUrl";

function LectureFlash() {
    // ========================================
    // STATE DE L'APPLICATION
    // ========================================
    const [state, setState] = useState(initialState);
    const [isAutoStarting, setIsAutoStarting] = useState(false);

    // ========================================
    // HOOK POUR LE CHARGEMENT CODIMD
    // ========================================
    const {
        markdown,
        loading,
        error,
        sourceUrl,
        speedConfig, // { speed: number, locked: boolean } ou null
        loadMarkdownFromUrl,
        reset,
    } = useMarkdownFromUrl();

    // ========================================
    // EFFET : Mise à jour du texte quand markdown est chargé
    // ========================================
    useEffect(() => {
        if (markdown) {
            setState((prevState) => ({
                ...prevState,
                texte: markdown,
            }));
        }
    }, [markdown]);

    // ========================================
    // OPTIMISATION : Auto-démarrage UNIQUEMENT si locked=true
    // Détection immédiate pour éviter le flash UI
    // ========================================
    useEffect(() => {
        // CONDITION CRITIQUE : On auto-démarre SEULEMENT si locked === true
        if (markdown && speedConfig && speedConfig.locked === true) {
            console.log(
                "🔒 Auto-démarrage en mode LOCKED avec vitesse:",
                speedConfig.speed
            );

            setIsAutoStarting(true);

            // Petit délai pour permettre l'affichage du message "démarrage auto..."
            setTimeout(() => {
                setState((prevState) => ({
                    ...prevState,
                    texte: markdown,
                    mode: mode.LECTURE,
                    vitesse: speedConfig.speed,
                }));
                setIsAutoStarting(false);
            }, 1500); // 1.5 seconde pour laisser le temps de lire le message
        }
        // Si locked === false (ou absent), on reste en mode SAISIE
        // L'utilisateur pourra alors choisir/modifier la vitesse
    }, [markdown, speedConfig]);

    // ========================================
    // DÉTECTION PRÉCOCE : Si speedConfig.locked=true est détecté
    // avant même le chargement du markdown, on prépare l'UI
    // ========================================
    useEffect(() => {
        if (speedConfig?.locked === true && !markdown && loading) {
            console.log("🔒 Mode locked détecté, préparation auto-démarrage");
            setIsAutoStarting(true);
        }
    }, [speedConfig, markdown, loading]);

    // ========================================
    // GESTION DES MODES
    // ========================================
    /**
     * Passe en mode lecture avec la vitesse choisie
     * @param {number} vitesse - Vitesse de lecture (mots/minute)
     */
    const switchModeLecture = (vitesse) => {
        setState({ ...state, mode: mode.LECTURE, vitesse });
    };

    /**
     * Revient en mode saisie
     */
    const switchModeSaisie = () => {
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
     * Réinitialise l'application (supprime texte cloud et config vitesse)
     */
    const handleReset = () => {
        setState(initialState);
        reset();
        setIsAutoStarting(false);
        // Nettoie l'URL des paramètres
        window.history.pushState({}, "", window.location.pathname);
    };

    // ========================================
    // RENDU
    // ========================================

    // Si mode LECTURE, afficher le composant Flash
    if (state.mode === mode.LECTURE) {
        return (
            <FlashAmelioreTest
                texte={state.texte}
                vitesse={state.vitesse}
                switchMode={switchModeSaisie}
            />
        );
    }

    // Sinon, afficher l'interface de saisie/choix
    return (
        <Input
            texte={state.texte}
            changeTexte={changeTexte}
            switchMode={switchModeLecture}
            onUrlSubmit={loadMarkdownFromUrl}
            loading={loading || isAutoStarting}
            error={error}
            sourceUrl={sourceUrl}
            onReset={handleReset}
            speedConfig={speedConfig}
        />
    );
}

export default LectureFlash;
