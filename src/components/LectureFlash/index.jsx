/**
 * Composant principal de l'application Lecture Flash
 * VERSION 3.6.0 : Architecture cohérente avec StepContainer enrichi
 *
 * Modifications v3.6.0 :
 * - locked=true : Étape 3 direct, PAS d'auto-start, PAS de "Changer vitesse"
 * - locked=false : Étape 3 direct, PAS d'auto-start, AVEC "Changer vitesse"
 * - StepContainer gère TOUS les titres avec icon et renderActions
 * - Gestion centralisée des modales (custom et share)
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
    const [showHelp, setShowHelp] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [hasStartedReading, setHasStartedReading] = useState(false);

    // États pour les modales (gérés ici pour cohérence architecturale)
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    // Labels et nombre total d'étapes
    const stepLabels = ["Texte", "Vitesse", "Lecture"];
    const totalSteps = 3;

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
    } = useMarkdownFromUrl();

    // ========================================
    // EFFECTS: URL Parameters Handling
    // ========================================

    /**
     * Détection et chargement automatique depuis URL
     * v3.6.0 : Toujours aller à l'étape 3 (lecture), jamais d'auto-start
     */
    useEffect(() => {
        if (markdown && speedConfig) {
            // Charger le texte
            setAppState((prev) => ({
                ...prev,
                text: markdown,
                speedWpm: speedConfig.speed,
            }));

            // Aller directement à l'étape 3 (lecture)
            setCurrentStep(3);
        }
    }, [markdown, speedConfig]);

    // ========================================
    // HANDLERS: Navigation
    // ========================================

    /**
     * Passage à l'étape suivante
     */
    const handleNextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    };

    /**
     * Retour à l'étape précédente
     */
    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    /**
     * Retour à l'étape précédente depuis la lecture
     * Conditionnel : masqué si locked=true
     */
    const handleBackToPreviousStep = () => {
        if (speedConfig?.locked) {
            return;
        }
        setCurrentStep(2);
        setHasStartedReading(false);
        setIsPaused(false);
    };

    /**
     * Réinitialisation complète
     */
    const reset = () => {
        setAppState(initialState);
        setCurrentStep(1);
        setHasStartedReading(false);
        setIsPaused(false);
        window.history.pushState({}, "", window.location.pathname);
    };

    // ========================================
    // HANDLERS: Text & Speed
    // ========================================

    /**
     * Mise à jour du texte
     */
    const handleTextChange = (newText) => {
        setAppState((prev) => ({ ...prev, text: newText }));
    };

    /**
     * Mise à jour de la vitesse
     */
    const handleSpeedChange = (speed) => {
        setAppState((prev) => ({ ...prev, speedWpm: speed }));
    };

    // ========================================
    // HANDLERS: Reading Controls
    // ========================================

    /**
     * Démarrage de la lecture
     * v3.6.0 : Appelé explicitement par le bouton "Démarrer"
     */
    const handleStartReading = () => {
        setHasStartedReading(true);
        setIsPaused(false);
    };

    /**
     * Pause/Reprise de la lecture
     */
    const handleTogglePause = () => {
        setIsPaused((prev) => !prev);
    };

    /**
     * Relancer la lecture depuis le début
     */
    const handleReplay = () => {
        setHasStartedReading(false);
        setIsPaused(false);
        setTimeout(() => {
            setHasStartedReading(true);
        }, 100);
    };

    /**
     * Fin de l'animation
     */
    const handleAnimationComplete = () => {
        setHasStartedReading(false);
        setIsPaused(false);
    };

    // ========================================
    // RENDER: Loading State
    // ========================================

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                        <p className="text-xl text-gray-700 font-medium">
                            Chargement du document...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================
    // RENDER: Error State
    // ========================================

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <span className="text-4xl">⚠️</span>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-semibold text-red-800 mb-2">
                                Erreur de chargement
                            </h3>
                            <p className="text-red-700 mb-4">{error}</p>
                            <button
                                onClick={reset}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                ← Retour à l'accueil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ========================================
    // RENDER: Reading Mode (Step 3)
    // ========================================

    if (currentStep === 3) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    {/* Messages contextuels selon speedConfig */}
                    {speedConfig?.locked && (
                        <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
                            <p className="text-orange-800 font-semibold">
                                🔒 Configuration de lecture imposée par votre
                                enseignant
                            </p>
                            <p className="text-sm text-orange-700 mt-1">
                                Vitesse : {speedConfig.speed} MLM (
                                {speedConfig.speed <= 60
                                    ? "CP-CE1"
                                    : speedConfig.speed <= 80
                                      ? "CE2"
                                      : "CM1-CM2"}
                                )
                            </p>
                        </div>
                    )}

                    {speedConfig && !speedConfig.locked && (
                        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                            <p className="text-blue-800 font-semibold">
                                ℹ️ Texte préparé par votre enseignant
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
                                Vous pouvez relire ou changer la vitesse si
                                nécessaire.
                            </p>
                        </div>
                    )}

                    {/* Affichage de la vitesse */}
                    <div className="mb-6 text-center">
                        <p className="text-sm text-gray-600 mb-2">
                            Vitesse de lecture
                        </p>
                        <p className="text-4xl font-bold text-blue-900">
                            {appState.speedWpm} MLM
                        </p>
                    </div>

                    {/* Contrôles de lecture */}
                    {!hasStartedReading ? (
                        <div className="flex justify-center mb-6">
                            <button
                                onClick={handleStartReading}
                                className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-xl shadow-lg transform hover:scale-105"
                                aria-label="Démarrer la lecture"
                            >
                                ▶️ Démarrer la lecture
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center gap-3 mb-6">
                            <button
                                onClick={handleTogglePause}
                                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-bold focus:outline-none focus:ring-4 focus:ring-yellow-300"
                                aria-label={
                                    isPaused
                                        ? "Reprendre la lecture"
                                        : "Mettre en pause"
                                }
                            >
                                {isPaused ? "▶️ Reprendre" : "⏸️ Pause"}
                            </button>
                            <button
                                onClick={handleReplay}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold focus:outline-none focus:ring-4 focus:ring-blue-300"
                                aria-label="Relire depuis le début"
                            >
                                🔄 Relire
                            </button>
                        </div>
                    )}

                    {/* Text animation */}
                    <TextAnimation
                        text={appState.text}
                        speedWpm={appState.speedWpm}
                        isStarted={hasStartedReading}
                        isPaused={isPaused}
                        onComplete={handleAnimationComplete}
                    />

                    {/* Bouton retour (conditionnel) */}
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
                </div>
            </div>
        );
    }

    // ========================================
    // RENDER: Input Mode (Steps 1-2)
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

            {/* First time message */}
            <FirstTimeMessage />

            {/* Step indicator */}
            <StepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                stepLabels={stepLabels}
            />

            {/* ======================================== */}
            {/* STEP 1: Text Input */}
            {/* ======================================== */}
            <StepContainer
                step={1}
                currentStep={currentStep}
                title="Charger ou saisir le texte"
                icon="📝"
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
                        className={`px-6 py-3 rounded-lg transition font-bold ${
                            appState.text.trim()
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Suivant : Choisir la vitesse →
                    </button>
                </div>
            </StepContainer>

            {/* ======================================== */}
            {/* STEP 2: Speed Selection */}
            {/* ======================================== */}
            <StepContainer
                step={2}
                currentStep={currentStep}
                title="Choisir la vitesse de lecture"
                icon="⚡"
                renderActions={() => (
                    <>
                        {/* Bouton Réglage personnalisé */}
                        {!speedConfig && (
                            <button
                                onClick={() => setShowCustomModal(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                                title="Ajuster la vitesse finement"
                            >
                                ⚙️ Réglage personnalisé
                            </button>
                        )}

                        {/* Bouton Partage */}
                        {sourceUrl && appState.speedWpm && (
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
                                title="Partager ce texte avec vos élèves"
                            >
                                🔗 Partager
                            </button>
                        )}
                    </>
                )}
            >
                <SpeedSelector
                    onSpeedChange={handleSpeedChange}
                    text={appState.text}
                    speedConfig={speedConfig}
                    selectedSpeed={appState.speedWpm}
                    sourceUrl={sourceUrl}
                    showCustomModal={showCustomModal}
                    setShowCustomModal={setShowCustomModal}
                    showShareModal={showShareModal}
                    setShowShareModal={setShowShareModal}
                />

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                    {/* Bouton Retour : masqué si lien partagé */}
                    {!speedConfig && (
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                        >
                            ← Changer le texte
                        </button>
                    )}

                    <button
                        onClick={handleNextStep}
                        disabled={!appState.speedWpm}
                        className={`px-6 py-3 rounded-lg transition font-bold ml-auto ${
                            appState.speedWpm
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Suivant : Lire →
                    </button>
                </div>
            </StepContainer>
        </div>
    );
}

export default LectureFlash;
