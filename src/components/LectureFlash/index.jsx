/**
 * Composant principal de l'application Lecture Flash
 * VERSION 3.4.0 : Architecture 3 étapes simplifiée - Partage intégré à l'étape 2
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
    const [isPaused, setIsPaused] = useState(false);
    const [hasStartedReading, setHasStartedReading] = useState(false);

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
    // COMPUTED: Dynamic step labels
    // ========================================
    const stepLabels = ["Texte", "Vitesse", "Lecture"];
    const totalSteps = 3;

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
    // EFFECT: Handle auto-start for locked speed
    // ========================================
    useEffect(() => {
        if (!markdown || !speedConfig) return;

        if (speedConfig.locked) {
            // Cas locked=true : Auto-démarrage immédiat
            setAppState((prev) => ({
                ...prev,
                speedWpm: speedConfig.speed,
            }));
            setIsAutoStarting(true);

            setTimeout(() => {
                switchToReadingMode();
                setHasStartedReading(true);
                setIsAutoStarting(false);
            }, 2000);
        } else if (!speedConfig.locked) {
            // Cas locked=false : Skip vers étape 2 avec pré-sélection
            setCurrentStep(2);
            setAppState((prev) => ({
                ...prev,
                speedWpm: speedConfig.speed,
            }));
        }
    }, [markdown, speedConfig]);

    // ========================================
    // HANDLERS: Mode switching
    // ========================================
    const switchToReadingMode = () => {
        setAppState((prev) => ({ ...prev, mode: mode.LECTURE }));
    };

    const switchToInputMode = () => {
        setAppState((prev) => ({ ...prev, mode: mode.INPUT }));
    };

    // ========================================
    // HANDLERS: Step navigation
    // ========================================
    const handleNextStep = () => {
        if (currentStep === 2) {
            // Passage direct en mode lecture depuis l'étape vitesse
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
    // HANDLERS: Text and speed changes
    // ========================================
    const handleTextChange = (newText) => {
        setAppState((prev) => ({ ...prev, text: newText }));
    };

    const handleSpeedChange = (speed) => {
        setAppState((prev) => ({ ...prev, speedWpm: speed }));
    };

    // ========================================
    // HANDLERS: Reading controls
    // ========================================
    const handleStartReading = () => {
        setHasStartedReading(true);
        setIsPaused(false);
    };

    const handleTogglePause = () => {
        setIsPaused((prev) => !prev);
    };

    const handleStop = () => {
        setHasStartedReading(false);
        setIsPaused(false);
    };

    const handleAnimationComplete = () => {
        setHasStartedReading(false);
        setIsPaused(false);
    };

    const handleBackToPreviousStep = () => {
        if (speedConfig?.locked) {
            return; // Pas de retour si vitesse imposée
        }

        setHasStartedReading(false);
        setIsPaused(false);
        setCurrentStep(2); // Retour à l'étape vitesse
        setAppState((prev) => ({
            ...prev,
            mode: mode.INPUT,
        }));
    };

    // ========================================
    // RENDER: Reading mode
    // ========================================
    if (appState.mode === mode.LECTURE) {
        return (
            <div className="container mx-auto p-4 relative">
                {/* Help button */}
                <div className="absolute top-0 right-0 z-10">
                    <Tooltip
                        content="Afficher l'aide complète"
                        position="bottom"
                    >
                        <button
                            onClick={() => setShowHelp(true)}
                            className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-bold text-lg"
                            aria-label="Aide"
                        >
                            ?
                        </button>
                    </Tooltip>
                </div>

                {/* Help modal */}
                <HelpModal
                    isOpen={showHelp}
                    onClose={() => setShowHelp(false)}
                />

                {/* Info messages */}
                <div className="mb-6">
                    {sourceUrl && !speedConfig?.locked && (
                        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                            <p className="text-sm text-blue-800 font-medium">
                                ☁️ Document chargé depuis CodiMD. Vous pouvez
                                relire ou changer la vitesse si nécessaire.
                            </p>
                        </div>
                    )}

                    {speedConfig?.locked && (
                        <div className="mb-4 p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                            <p className="text-sm text-orange-800 font-medium">
                                🔒 Configuration de lecture imposée par votre
                                enseignant (vitesse : {speedConfig.speed} MLM)
                            </p>
                        </div>
                    )}
                </div>

                {/* Auto-starting message */}
                {isAutoStarting && (
                    <div className="text-center p-8 mb-6">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">
                            Démarrage automatique de la lecture...
                        </p>
                    </div>
                )}

                {/* Main reading interface */}
                {!isAutoStarting && (
                    <>
                        {/* Control buttons */}
                        <div className="flex justify-center gap-3 mb-6">
                            {!hasStartedReading && (
                                <button
                                    onClick={handleStartReading}
                                    className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-lg focus:outline-none focus:ring-4 focus:ring-green-300"
                                    aria-label={`Commencer la lecture à ${appState.speedWpm} mots par minute`}
                                >
                                    🚀 Commencer la lecture à{" "}
                                    {appState.speedWpm} MLM
                                </button>
                            )}

                            {hasStartedReading && (
                                <>
                                    <button
                                        onClick={handleTogglePause}
                                        className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-bold focus:outline-none focus:ring-4 focus:ring-amber-300"
                                        aria-label={
                                            isPaused
                                                ? "Reprendre la lecture"
                                                : "Mettre en pause"
                                        }
                                    >
                                        {isPaused ? "▶️ Reprendre" : "⏸️ Pause"}
                                    </button>
                                    <button
                                        onClick={handleStop}
                                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold focus:outline-none focus:ring-4 focus:ring-red-300"
                                        aria-label="Arrêter la lecture"
                                    >
                                        ⏹️ Arrêter
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Text animation */}
                        <TextAnimation
                            text={appState.text}
                            speedWpm={appState.speedWpm}
                            isStarted={hasStartedReading}
                            isPaused={isPaused}
                            onComplete={handleAnimationComplete}
                        />

                        {/* Back button (conditional) */}
                        {!speedConfig?.locked && (
                            <div className="flex justify-center gap-3 mt-6">
                                <button
                                    onClick={handleBackToPreviousStep}
                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                                >
                                    ← Changer la vitesse
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }

    // ========================================
    // RENDER: Input mode (3 steps)
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

            {/* Help modal */}
            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

            {/* First-time message */}
            <FirstTimeMessage />

            {/* Step indicator */}
            <StepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                stepLabels={stepLabels}
            />

            {/* STEP 1: Text input */}
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
                    onReset={reset}
                />

                {/* Navigation */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleNextStep}
                        disabled={!appState.text.trim()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-bold focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        Suivant : Choisir la vitesse →
                    </button>
                </div>
            </StepContainer>

            {/* STEP 2: Speed selection + Sharing (if CodiMD) */}
            <StepContainer
                step={2}
                currentStep={currentStep}
                title="⚡ Choisir la vitesse de lecture"
            >
                <SpeedSelector
                    onSpeedChange={handleSpeedChange}
                    text={appState.text}
                    speedConfig={speedConfig}
                    selectedSpeed={appState.speedWpm}
                    sourceUrl={sourceUrl}
                />

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={handlePreviousStep}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                    >
                        ← Retour
                    </button>
                    <button
                        onClick={handleNextStep}
                        disabled={!appState.speedWpm}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-bold focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                        Suivant : Lire →
                    </button>
                </div>
            </StepContainer>
        </div>
    );
}

export default LectureFlash;
