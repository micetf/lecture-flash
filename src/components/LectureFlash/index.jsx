/**
 * Composant principal de l'application Lecture Flash
 * VERSION 4.0.0 : Architecture clarifiée - Tous les boutons dans le parent
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
    // COMPUTED: Dynamic total steps
    // ========================================
    const totalSteps = sourceUrl ? 4 : 3;

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
        } else if (speedConfig && !speedConfig.locked) {
            setCurrentStep(2);
            setAppState((prev) => ({
                ...prev,
                speedWpm: speedConfig.speed,
            }));
        }
    }, [markdown, speedConfig, sourceUrl]);

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
    // HANDLERS: Navigation between steps
    // ========================================
    const handleNextStep = () => {
        if (currentStep === 2 && !sourceUrl) {
            // Passage direct en mode lecture depuis l'étape vitesse
            switchToReadingMode();
        } else if (currentStep === 3 && sourceUrl) {
            // Passage direct en mode lecture depuis l'étape partage
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

    const handleTextChange = (newText) => {
        setAppState((prev) => ({ ...prev, text: newText }));
    };

    const handleSpeedChange = (speed) => {
        setAppState((prev) => ({ ...prev, speedWpm: speed }));
    };

    // ========================================
    // HANDLERS: Reading mode controls
    // ========================================

    /**
     * Démarrage de la lecture
     */
    const handleStartReading = () => {
        setHasStartedReading(true);
        setIsPaused(false);
    };

    /**
     * Toggle pause/resume
     */
    const handleTogglePause = () => {
        setIsPaused((prev) => !prev);
    };

    /**
     * Arrêt complet : retour à l'état initial
     */
    const handleStop = () => {
        setHasStartedReading(false);
        setIsPaused(false);
    };

    /**
     * Animation terminée automatiquement
     */
    const handleAnimationComplete = () => {
        setHasStartedReading(false);
        setIsPaused(false);
    };
    console.log("RENDER - mode:", appState.mode, "step:", currentStep);

    const handleBackToPreviousStep = () => {
        if (speedConfig?.locked) {
            return;
        }

        const previousStep = sourceUrl ? 3 : 2;

        console.log(
            "Avant changement - mode:",
            appState.mode,
            "step:",
            currentStep
        );

        setHasStartedReading(false);
        setIsPaused(false);
        setCurrentStep(previousStep);
        setAppState((prev) => ({
            ...prev,
            mode: mode.INPUT,
        }));

        console.log("Après changement demandé - previousStep:", previousStep);
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

                <FirstTimeMessage />

                <HelpModal
                    isOpen={showHelp}
                    onClose={() => setShowHelp(false)}
                />

                <StepIndicator
                    currentStep={totalSteps}
                    totalSteps={totalSteps}
                    stepLabels={stepLabels}
                />

                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-3">
                        Mode lecture
                    </h2>

                    {/* Contextual messages */}
                    {speedConfig && !speedConfig.locked && (
                        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                            <p className="text-sm text-blue-800">
                                ℹ️ Texte préparé par votre enseignant. Vous
                                pouvez relire ou changer la vitesse si
                                nécessaire.
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
                            {/* === BOUTONS DE CONTRÔLE AU-DESSUS === */}
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
                                            {isPaused
                                                ? "▶️ Reprendre"
                                                : "⏸ Pause"}
                                        </button>
                                        <button
                                            onClick={handleStop}
                                            className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-bold focus:outline-none focus:ring-4 focus:ring-rose-300"
                                            aria-label="Arrêter la lecture"
                                        >
                                            ⏹ Arrêter
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* === COMPOSANT TEXTANIMATION (SANS BOUTONS) === */}
                            <TextAnimation
                                text={appState.text}
                                speedWpm={appState.speedWpm}
                                isStarted={hasStartedReading}
                                isPaused={isPaused}
                                onComplete={handleAnimationComplete}
                            />

                            {/* === BOUTON ÉTAPE PRÉCÉDENTE EN-DESSOUS === */}
                            <div className="flex justify-center mt-6">
                                {!speedConfig?.locked && (
                                    <button
                                        onClick={handleBackToPreviousStep}
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        aria-label="Retour à l'étape précédente"
                                    >
                                        ← Étape précédente
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // ========================================
    // RENDER: Input mode with workflow
    // ========================================

    return (
        <div className="container mx-auto p-4 relative">
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

            <FirstTimeMessage />

            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

            <StepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                stepLabels={stepLabels}
            />

            {/* STEP 1: Text input */}
            <StepContainer
                step={1}
                currentStep={currentStep}
                title="Charger ou saisir le texte"
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

                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleNextStep}
                        disabled={!appState.text.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                    >
                        Suivant : Vitesse →
                    </button>
                </div>
            </StepContainer>

            {/* STEP 2: Speed selection */}
            <StepContainer
                step={2}
                currentStep={currentStep}
                title="Choisir la vitesse de lecture"
            >
                <SpeedSelector
                    onSpeedChange={handleSpeedChange}
                    text={appState.text}
                    speedConfig={speedConfig}
                    selectedSpeed={appState.speedWpm}
                />

                <div className="flex justify-between mt-4">
                    {!speedConfig && (
                        <button
                            onClick={handlePreviousStep}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                        >
                            ← Retour
                        </button>
                    )}

                    <button
                        onClick={handleNextStep}
                        disabled={!appState.speedWpm}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                    >
                        {sourceUrl
                            ? "Suivant : Partager →"
                            : "Lancer la lecture →"}
                    </button>
                </div>
            </StepContainer>

            {/* STEP 3: Share configuration (CONDITIONAL) */}
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
                            Lancer la lecture →
                        </button>
                    </div>
                </StepContainer>
            )}
        </div>
    );
}

export default LectureFlash;
