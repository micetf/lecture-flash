import React, { useState, useEffect } from "react";

import Input from "./Input";
import Flash from "./Flash";
import initialState from "./initialState";
import { mode } from "./parametres.js";

// ========================================
// IMPORTS CORRIGÉS - Sans extension .jsx
// ========================================
import { CloudUrlInput } from "../CloudUrlInput";
import { ShareCloudLink } from "../ShareCloudLink";
import { useMarkdownFromUrl } from "../../hooks/useMarkdownFromUrl";

function LectureFlash() {
    // ========================================
    // STATE EXISTANT
    // ========================================
    const [state, setState] = useState(initialState);

    // ========================================
    // NOUVEAU : Hook pour le chargement cloud
    // ========================================
    const { markdown, loading, error, sourceUrl, loadMarkdownFromUrl, reset } =
        useMarkdownFromUrl();

    // ========================================
    // NOUVEAU : Effet pour mettre à jour le texte quand markdown est chargé
    // ========================================
    useEffect(() => {
        if (markdown) {
            setState((prevState) => ({ ...prevState, texte: markdown }));
        }
    }, [markdown]);

    // ========================================
    // FONCTIONS EXISTANTES
    // ========================================
    const switchModeLecture = (vitesse) => {
        setState({ ...state, mode: mode.LECTURE, vitesse });
    };

    const switchModeSaisie = () => {
        setState({ ...state, mode: mode.SAISIE });
    };

    const changeTexte = (texte) => {
        setState({ ...state, texte });
    };

    // ========================================
    // NOUVELLE FONCTION : Réinitialisation
    // ========================================
    const handleReset = () => {
        setState(initialState);
        reset();
        window.history.pushState({}, "", window.location.pathname);
    };

    return (
        <div className="container">
            {/* ========================================
                MODE SAISIE : Afficher Input avec les nouveaux composants
            ======================================== */}
            {state.mode === mode.SAISIE ? (
                <>
                    {/* Composant de chargement cloud */}
                    <CloudUrlInput
                        onUrlSubmit={loadMarkdownFromUrl}
                        loading={loading}
                        error={error}
                    />

                    {/* Lien de partage si fichier chargé */}
                    {sourceUrl && markdown && (
                        <ShareCloudLink cloudUrl={sourceUrl} />
                    )}

                    {/* Badge indicateur si texte chargé depuis le cloud */}
                    {sourceUrl && (
                        <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
                            <span>
                                <strong>☁️ Texte chargé depuis le cloud</strong>
                            </span>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={handleReset}
                            >
                                Réinitialiser
                            </button>
                        </div>
                    )}

                    {/* Composant Input existant */}
                    <Input
                        texte={state.texte}
                        changeTexte={changeTexte}
                        switchMode={switchModeLecture}
                    />
                </>
            ) : (
                /* ========================================
                    MODE LECTURE : Afficher Flash (inchangé)
                ======================================== */
                <Flash {...state} switchMode={switchModeSaisie} />
            )}
        </div>
    );
}

export default LectureFlash;
