/**
 * Composant principal de l'application Lecture Flash
 * VERSION 3.1.0 : Workflow en 4 étapes + Système d'aide restauré
 *
 * @component
 * @returns {JSX.Element}
 */

import React, { useState, useEffect } from "react";
import FlashAmelioreTest from "./Flash/FlashAmelioreTest";
import TextInputManager from "./Input/TextInputManager";
import ChoixVitesseAmeliore from "./Flash/ChoixVitesseAmeliore";
import StepIndicator from "./StepIndicator";
import StepContainer from "./StepContainer";
import ShareConfiguration from "./ShareConfiguration";
import HelpModal from "../HelpModal";
import FirstTimeMessage from "../FirstTimeMessage";
import Tooltip from "../Tooltip";
import initialState from "./initialState";
import { mode } from "./parametres.js";
import { useMarkdownFromUrl } from "../../hooks/useMarkdownFromUrl";

function LectureFlash() {
    // ========================================
    // STATE
    // ========================================
    const [step, setStep] = useState(1);
    const [state, setState] = useState(initialState);
    const [isAutoStarting, setIsAutoStarting] = useState(false);
    const [showHelp, setShowHelp] = useState(false); // 🆕 État pour HelpModal

    // ========================================
    // HOOK CHARGEMENT CODIMD
    // ========================================
    const {
        markdown,
        loading,
        error,
        sourceUrl,
        speedConfig,
        loadMarkdownFromUrl,
        reset,
    } = useMarkdownFromUrl();

    // ========================================
    // EFFET : Chargement texte depuis markdown
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
    // EFFET : Gestion des skips automatiques
    // ========================================
    useEffect(() => {
        if (!markdown) return;

        if (speedConfig?.locked) {
            setStep(4);
            setIsAutoStarting(true);
            setTimeout(() => {
                switchModeLecture(speedConfig.speed);
                setIsAutoStarting(false);
            }, 2000);
        } else if (speedConfig && !speedConfig.locked) {
            setStep(2);
        }
    }, [markdown, speedConfig]);

    // ========================================
    // HANDLERS
    // ========================================
    const changeTexte = (texte) => {
        setState({ ...state, texte });
    };

    const switchModeLecture = (vitesse) => {
        setState({ ...state, mode: mode.LECTURE, vitesse });
    };

    const switchModeSaisie = () => {
        setState({ ...state, mode: mode.SAISIE });
        setStep(1);
    };

    const handleReset = () => {
        setState(initialState);
        reset();
        setIsAutoStarting(false);
        setStep(1);
        window.history.pushState({}, "", window.location.pathname);
    };

    const handleSpeedSelected = (vitesse) => {
        setState((prev) => ({ ...prev, vitesse }));
    };

    // ========================================
    // NAVIGATION ENTRE ÉTAPES
    // ========================================
    const goToNextStep = () => {
        if (step === 2) {
            setStep(sourceUrl ? 3 : 4);
        } else {
            setStep(step + 1);
        }
    };

    const goToPreviousStep = () => {
        if (step === 3) {
            setStep(2);
        } else if (step === 4) {
            setStep(sourceUrl ? 3 : 2);
        } else {
            setStep(step - 1);
        }
    };

    const startReading = (vitesse) => {
        switchModeLecture(vitesse);
    };

    // ========================================
    // RENDU MODE LECTURE
    // ========================================
    if (state.mode === mode.LECTURE) {
        return (
            <FlashAmelioreTest
                texte={state.texte}
                vitesse={state.vitesse}
                switchMode={switchModeSaisie}
            />
        );
    }

    // ========================================
    // RENDU MODE SAISIE (WORKFLOW 4 ÉTAPES)
    // ========================================
    const isSharedLink = speedConfig !== null;
    const canGoBack = step > 1 && !isSharedLink;

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            {/* 🆕 MESSAGE PREMIÈRE VISITE */}
            <FirstTimeMessage />

            {/* 🆕 MODALE D'AIDE */}
            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

            <div className="max-w-5xl mx-auto">
                {/* HEADER AVEC BOUTON AIDE */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        📖 Lecture Flash
                    </h1>

                    {/* 🆕 BOUTON D'AIDE */}
                    <Tooltip content="Aide et mode d'emploi" position="bottom">
                        <button
                            onClick={() => setShowHelp(true)}
                            className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition flex items-center justify-center font-bold text-lg shadow-lg"
                            aria-label="Afficher l'aide complète"
                        >
                            ?
                        </button>
                    </Tooltip>
                </div>

                {/* INDICATEUR DE PROGRESSION */}
                <StepIndicator
                    currentStep={step}
                    totalSteps={4}
                    stepLabels={["Texte", "Vitesse", "Partage", "Lecture"]}
                />

                {/* ÉTAPE 1 : TEXTE */}
                <StepContainer
                    step={1}
                    currentStep={step}
                    title="📝 Charger ou saisir le texte"
                >
                    <TextInputManager
                        texte={state.texte}
                        changeTexte={changeTexte}
                        onUrlSubmit={loadMarkdownFromUrl}
                        loading={loading}
                        error={error}
                        sourceUrl={sourceUrl}
                        onReset={handleReset}
                    />

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={goToNextStep}
                            disabled={!state.texte.trim()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                        >
                            Suivant : Choisir la vitesse →
                        </button>
                    </div>
                </StepContainer>

                {/* ÉTAPE 2 : VITESSE */}
                <StepContainer
                    step={2}
                    currentStep={step}
                    title="⚡ Choisir la vitesse de lecture"
                >
                    {/* Message si lien partagé avec vitesse suggérée */}
                    {speedConfig && !speedConfig.locked && (
                        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                            <p className="text-sm text-yellow-800 flex items-center gap-2">
                                <span className="text-xl">⭐</span>
                                <strong>
                                    Vitesse recommandée : {speedConfig.speed}{" "}
                                    MLM
                                </strong>
                                <span className="text-gray-600">
                                    (mais vous pouvez la modifier)
                                </span>
                            </p>
                        </div>
                    )}

                    {/* Message si texte chargé depuis lien partagé */}
                    {isSharedLink && (
                        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                            <p className="text-sm text-blue-800 flex items-center gap-2">
                                <span>ℹ️</span>
                                Texte chargé depuis un lien partagé (non
                                modifiable)
                            </p>
                        </div>
                    )}

                    <ChoixVitesseAmeliore
                        onSpeedSelected={handleSpeedSelected}
                        speedConfig={speedConfig}
                    />

                    <div className="flex justify-between mt-6">
                        {canGoBack && (
                            <button
                                onClick={goToPreviousStep}
                                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                            >
                                ← Retour
                            </button>
                        )}

                        <button
                            onClick={goToNextStep}
                            disabled={!state.vitesse}
                            className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition ${
                                !canGoBack ? "ml-auto" : ""
                            }`}
                        >
                            {sourceUrl
                                ? "Suivant : Partager →"
                                : "Suivant : Lire →"}
                        </button>
                    </div>
                </StepContainer>

                {/* ÉTAPE 3 : PARTAGE (optionnel) */}
                {sourceUrl && (
                    <StepContainer
                        step={3}
                        currentStep={step}
                        title="🔗 Partager ce texte avec une vitesse"
                    >
                        <ShareConfiguration
                            sourceUrl={sourceUrl}
                            currentSpeed={state.vitesse}
                        />

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={goToPreviousStep}
                                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                            >
                                ← Retour
                            </button>

                            <button
                                onClick={goToNextStep}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                            >
                                Passer au mode lecture →
                            </button>
                        </div>
                    </StepContainer>
                )}

                {/* ÉTAPE 4 : LECTURE */}
                <StepContainer
                    step={4}
                    currentStep={step}
                    title="🎬 Prêt à commencer la lecture"
                >
                    {/* Message si lecture auto-start (locked) */}
                    {isAutoStarting && (
                        <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded animate-fade-in">
                            <p className="text-lg text-green-800 font-semibold flex items-center gap-2">
                                <span>🔒</span>
                                Configuration automatique : Lecture à{" "}
                                {speedConfig.speed} MLM
                            </p>
                            <p className="text-sm text-green-700 mt-2">
                                Démarrage dans 2 secondes...
                            </p>
                        </div>
                    )}

                    {/* Message si lecture normale */}
                    {!isAutoStarting && (
                        <>
                            <div className="p-6 bg-white border-2 border-blue-200 rounded-lg">
                                <p className="text-lg text-gray-800 mb-4">
                                    <strong>Vitesse sélectionnée :</strong>{" "}
                                    {state.vitesse} MLM
                                </p>
                                <p className="text-sm text-gray-600">
                                    Cliquez sur "Commencer la lecture" pour
                                    démarrer l'animation de disparition
                                    progressive du texte.
                                </p>
                            </div>

                            <div className="flex justify-between mt-6">
                                {!isSharedLink && (
                                    <button
                                        onClick={goToPreviousStep}
                                        className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                                    >
                                        ← Retour
                                    </button>
                                )}

                                <button
                                    onClick={() => startReading(state.vitesse)}
                                    className={`px-8 py-4 bg-green-600 text-white text-lg rounded-lg font-bold hover:bg-green-700 transition shadow-lg ${
                                        isSharedLink ? "mx-auto" : "ml-auto"
                                    }`}
                                >
                                    🚀 Commencer la lecture
                                </button>
                            </div>
                        </>
                    )}
                </StepContainer>
            </div>
        </div>
    );
}

export default LectureFlash;
