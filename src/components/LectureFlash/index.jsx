/**
 * Main Lecture Flash application component
 * VERSION 3.1.0 : 4-step workflow + Help system restored
 *
 * @component
 * @returns {JSX.Element}
 */

import React, { useState, useEffect } from "react";
import TextAnimation from "./Flash/TextAnimation";
import SpeedSelector from "./Flash/SpeedSelector";
import TextInputManager from "./Input/TextInputManager";
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
    const [currentStep, setCurrentStep] = useState(1);
    const [appState, setAppState] = useState(initialState);
    const [isAutoStarting, setIsAutoStarting] = useState(false);
    const [showHelp, setShowHelp] = useState(false); // Help modal state

    // ========================================
    // CODIMD LOADING HOOK
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
    // EFFECT: Load text from markdown
    // ========================================
    useEffect(() => {
        if (markdown) {
            setAppState((prevState) => ({
                ...prevState,
                text: markdown,
            }));
        }
    }, [markdown]);

    // ========================================
    // EFFECT: Handle auto-skips
    // ========================================
    useEffect(() => {
        if (!markdown) return;

        if (speedConfig?.locked) {
            setCurrentStep(4);
            setIsAutoStarting(true);
            setTimeout(() => {
                switchToReadingMode(speedConfig.speed);
                setIsAutoStarting(false);
            }, 2000);
        } else if (speedConfig && !speedConfig.locked) {
            setCurrentStep(2);
        }
    }, [markdown, speedConfig]);

    // ========================================
    // HANDLERS
    // ========================================
    const handleTextChange = (text) => {
        setAppState({ ...appState, text });
    };

    const switchToReadingMode = (speedWpm) => {
        setAppState({ ...appState, mode: mode.LECTURE, speedWpm });
    };

    const switchToInputMode = () => {
        setAppState({ ...appState, mode: mode.SAISIE });
        setCurrentStep(1);
    };

    const handleReset = () => {
        setAppState(initialState);
        reset();
        setIsAutoStarting(false);
        setCurrentStep(1);
        window.history.pushState({}, "", window.location.pathname);
    };

    const handleSpeedSelected = (speedWpm) => {
        setAppState((prev) => ({ ...prev, speedWpm }));
    };

    // ========================================
    // STEP NAVIGATION
    // ========================================
    const goToNextStep = () => {
        if (currentStep === 2) {
            setCurrentStep(sourceUrl ? 3 : 4);
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPreviousStep = () => {
        if (currentStep === 3) {
            setCurrentStep(2);
        } else if (currentStep === 4) {
            setCurrentStep(sourceUrl ? 3 : 2);
        } else {
            setCurrentStep(currentStep - 1);
        }
    };

    const startReading = (speedWpm) => {
        switchToReadingMode(speedWpm);
    };

    // ========================================
    // READING MODE RENDER
    // ========================================
    if (appState.mode === mode.LECTURE) {
        return (
            <TextAnimation
                text={appState.text}
                speedWpm={appState.speedWpm}
                onSwitchMode={switchToInputMode}
            />
        );
    }

    // ========================================
    // INPUT MODE RENDER (4-STEP WORKFLOW)
    // ========================================
    const isSharedLink = speedConfig !== null;
    const canGoBack = currentStep > 1 && !isSharedLink;

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            {/* First-time message */}
            <FirstTimeMessage />

            {/* Help modal */}
            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

            <div className="max-w-5xl mx-auto">
                {/* Header with help button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        📖 Lecture Flash
                    </h1>

                    {/* Help button */}
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

                {/* Step indicator */}
                <StepIndicator
                    currentStep={currentStep}
                    totalSteps={4}
                    stepLabels={["Texte", "Vitesse", "Partage", "Lecture"]}
                />

                {/* STEP 1: TEXT */}
                <StepContainer
                    step={1}
                    currentStep={currentStep}
                    title="📝 Charger ou saisir le texte"
                >
                    <TextInputManager
                        text={appState.text}
                        onTextChange={handleTextChange}
                        onUrlSubmit={loadMarkdownFromUrl}
                        loading={loading}
                        error={error}
                        sourceUrl={sourceUrl}
                        onReset={handleReset}
                        speedConfig={speedConfig}
                    />

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={goToNextStep}
                            disabled={!appState.text.trim()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                        >
                            Suivant : Choisir la vitesse →
                        </button>
                    </div>
                </StepContainer>

                {/* STEP 2: SPEED */}
                <StepContainer
                    step={2}
                    currentStep={currentStep}
                    title="⚡ Choisir la vitesse de lecture"
                >
                    {/* Message if shared link with suggested speed */}
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

                    {/* Message if text loaded from shared link */}
                    {isSharedLink && (
                        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                            <p className="text-sm text-blue-800 flex items-center gap-2">
                                <span>ℹ️</span>
                                Texte chargé depuis un lien partagé (non
                                modifiable)
                            </p>
                        </div>
                    )}

                    <SpeedSelector
                        onSpeedChange={handleSpeedSelected}
                        text={appState.text}
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
                            disabled={!appState.speedWpm}
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

                {/* STEP 3: SHARE (optional) */}
                {sourceUrl && (
                    <StepContainer
                        step={3}
                        currentStep={currentStep}
                        title="🔗 Partager ce texte avec une vitesse"
                    >
                        <ShareConfiguration
                            sourceUrl={sourceUrl}
                            currentSpeed={appState.speedWpm}
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

                {/* STEP 4: READING */}
                <StepContainer
                    step={4}
                    currentStep={currentStep}
                    title="🎬 Prêt à commencer la lecture"
                >
                    {/* Message if auto-start reading (locked) */}
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

                    {/* Normal reading message */}
                    {!isAutoStarting && (
                        <>
                            <div className="p-6 bg-white border-2 border-blue-200 rounded-lg">
                                <p className="text-lg text-gray-800 mb-4">
                                    <strong>Vitesse sélectionnée :</strong>{" "}
                                    {appState.speedWpm} MLM
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
                                    onClick={() =>
                                        startReading(appState.speedWpm)
                                    }
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
