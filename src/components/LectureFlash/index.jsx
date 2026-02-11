/**
 * Main Lecture Flash application component
 * VERSION 3.2.0 : Conditional step 3 based on sourceUrl
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
    const [showHelp, setShowHelp] = useState(false);

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
    // COMPUTED: Dynamic total steps
    // ========================================
    const totalSteps = sourceUrl ? 4 : 3; // 4 steps if CodiMD, 3 otherwise

    // Dynamic step labels
    const stepLabels = sourceUrl
        ? ["Texte", "Vitesse", "Partager", "Lecture"]
        : ["Texte", "Vitesse", "Lecture"];

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
    // EFFECT: Handle auto-skips based on speedConfig
    // ========================================
    useEffect(() => {
        if (!markdown) return;

        if (speedConfig?.locked) {
            // Skip directly to step 4 (reading) with locked speed
            setCurrentStep(sourceUrl ? 4 : 3); // Adjust based on total steps
            setIsAutoStarting(true);
            setTimeout(() => {
                switchToReadingMode(speedConfig.speed);
                setIsAutoStarting(false);
            }, 2000);
        } else if (speedConfig?.speed) {
            // Skip to step 2 (speed selection) with suggested speed
            setCurrentStep(2);
            setAppState((prev) => ({
                ...prev,
                speedWpm: speedConfig.speed,
            }));
        }
    }, [markdown, speedConfig, sourceUrl]);

    // ========================================
    // HANDLERS
    // ========================================

    const handleTextChange = (newText) => {
        setAppState((prev) => ({ ...prev, text: newText }));
    };

    const handleSpeedChange = (speed) => {
        setAppState((prev) => ({ ...prev, speedWpm: speed }));
    };

    const switchToReadingMode = (speed) => {
        setAppState((prev) => ({
            ...prev,
            mode: mode.LECTURE,
            speedWpm: speed || prev.speedWpm,
        }));
    };

    const switchToInputMode = () => {
        setAppState((prev) => ({
            ...prev,
            mode: mode.SAISIE,
        }));
        setCurrentStep(1);
    };

    const handleReset = () => {
        reset();
        setAppState(initialState);
        setCurrentStep(1);
    };

    const handleNextStep = () => {
        if (currentStep === 2 && !sourceUrl) {
            // Skip step 3 if no CodiMD source
            setCurrentStep(3); // Actually maps to step 4 in display
            switchToReadingMode();
        } else if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    // ========================================
    // RENDERING CONDITIONS
    // ========================================

    const canGoToStep2 = appState.text.trim() !== "";
    const canGoToStep3Or4 = appState.speedWpm !== null;

    // ========================================
    // RENDER: Reading mode
    // ========================================

    if (appState.mode === mode.LECTURE) {
        return (
            <div className="container mx-auto p-4 relative">
                <TextAnimation
                    text={appState.text}
                    speedWpm={appState.speedWpm}
                    onSwitchMode={switchToInputMode}
                />
            </div>
        );
    }

    // ========================================
    // RENDER: Input mode with workflow
    // ========================================

    return (
        <div className="container mx-auto p-4 relative">
            {/* Help button */}
            <div className="absolute top-0 right-0 z-10">
                <Tooltip content="Afficher l'aide complète" position="bottom">
                    <button
                        onClick={() => setShowHelp(true)}
                        className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-bold text-lg"
                        aria-label="Aide"
                    >
                        ?
                    </button>
                </Tooltip>
            </div>

            {/* First-time message */}
            <FirstTimeMessage />

            {/* Help modal */}
            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

            {/* Step indicator - DYNAMIC based on sourceUrl */}
            <StepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                stepLabels={stepLabels}
            />

            {/* STEP 1: Load text */}
            <StepContainer
                step={1}
                currentStep={currentStep}
                title="Charger le texte"
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

                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleNextStep}
                        disabled={!canGoToStep2}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                    >
                        Suivant : Vitesse →
                    </button>
                </div>
            </StepContainer>

            {/* STEP 2: Choose speed */}
            <StepContainer
                step={2}
                currentStep={currentStep}
                title="Choisir la vitesse de lecture"
            >
                <SpeedSelector
                    onSpeedChange={handleSpeedChange}
                    text={appState.text}
                    speedConfig={speedConfig}
                />

                <div className="flex justify-between mt-4">
                    <button
                        onClick={handlePreviousStep}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                    >
                        ← Retour
                    </button>
                    <button
                        onClick={handleNextStep}
                        disabled={!canGoToStep3Or4}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                    >
                        {sourceUrl
                            ? "Suivant : Partager →"
                            : "Suivant : Lire →"}
                    </button>
                </div>
            </StepContainer>

            {/* STEP 3: Share configuration (CONDITIONAL - only if CodiMD) */}
            {sourceUrl && (
                <StepContainer
                    step={3}
                    currentStep={currentStep}
                    title="Partager avec vos élèves"
                >
                    <ShareConfiguration
                        sourceUrl={sourceUrl}
                        speedWpm={appState.speedWpm}
                    />

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handlePreviousStep}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                        >
                            ← Retour
                        </button>
                        <button
                            onClick={handleNextStep}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                        >
                            Passer au mode lecture →
                        </button>
                    </div>
                </StepContainer>
            )}

            {/* STEP 4 (or 3 if no CodiMD): Reading - trigger switch */}
            {currentStep === totalSteps && (
                <StepContainer
                    step={totalSteps}
                    currentStep={currentStep}
                    title="Mode lecture"
                >
                    {isAutoStarting ? (
                        <div className="text-center p-8">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">
                                Démarrage automatique de la lecture...
                            </p>
                        </div>
                    ) : (
                        <div className="text-center p-8">
                            <button
                                onClick={() => switchToReadingMode()}
                                className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-lg"
                            >
                                🚀 Lancer la lecture
                            </button>
                        </div>
                    )}

                    <div className="flex justify-start mt-4">
                        <button
                            onClick={handlePreviousStep}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                        >
                            ← Retour
                        </button>
                    </div>
                </StepContainer>
            )}
        </div>
    );
}

export default LectureFlash;
