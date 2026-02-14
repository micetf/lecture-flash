/**
 * Composant principal de l'application Lecture Flash
 * VERSION 3.7.0 : Correction chargement CodiMD + invalidation lien si modifié
 *
 * Modifications v3.7.0 :
 * - Ajout state isCodiMDTextUnmodified pour tracker validité du lien
 * - 2 effets séparés pour chargement CodiMD (avec/sans speedConfig)
 * - Invalidation lien CodiMD si texte modifié ou remplacé
 * - Passage conditionnel de sourceUrl au TextInputManager
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
import HelpModal from "../HelpModal.jsx";
import FirstTimeMessage from "../FirstTimeMessage.jsx";
import Tooltip from "../Tooltip.jsx";
import initialState from "../../config/initialState";
import { STEP_LABELS, TOTAL_STEPS } from "../../config/constants";
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

    // État pour tracker si le texte actuel est toujours celui de CodiMD
    const [isCodiMDTextUnmodified, setIsCodiMDTextUnmodified] = useState(false);

    // État pour les options d'affichage
    const [optionsAffichage, setOptionsAffichage] = useState({
        police: "default",
        taille: 100,
    });

    // Labels et nombre total d'étapes
    const stepLabels = STEP_LABELS;
    const totalSteps = TOTAL_STEPS;

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
        reset: resetMarkdownHook,
    } = useMarkdownFromUrl();

    // ========================================
    // EFFECTS: URL Parameters Handling
    // ========================================

    /**
     * CAS 1 : CodiMD AVEC speedConfig (lien partagé par enseignant)
     * v3.7.0 : Ajout setIsCodiMDTextUnmodified(true)
     */
    useEffect(() => {
        if (markdown && speedConfig) {
            // Charger le texte + vitesse
            setAppState((prev) => ({
                ...prev,
                text: markdown,
                speedWpm: speedConfig.speed,
            }));

            // Aller directement à l'étape 3 (lecture)
            setCurrentStep(3);

            // Marquer le texte comme provenant de CodiMD
            setIsCodiMDTextUnmodified(true);

            console.log(
                "✅ Texte CodiMD chargé avec speedConfig:",
                speedConfig
            );
        }
    }, [markdown, speedConfig]);

    /**
     * CAS 2 : CodiMD SANS speedConfig (chargement manuel)
     * v3.7.0 : Nouvel effet pour gérer le cas sans speedConfig
     */
    useEffect(() => {
        if (markdown && !speedConfig) {
            // Charger juste le texte, rester à l'étape 1
            setAppState((prev) => ({
                ...prev,
                text: markdown,
            }));

            // Marquer le texte comme provenant de CodiMD
            setIsCodiMDTextUnmodified(true);

            console.log("✅ Texte CodiMD chargé dans le champ de saisie");
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
     * v3.7.0 : Ajout setIsCodiMDTextUnmodified(false)
     */
    const reset = () => {
        setAppState(initialState);
        setCurrentStep(1);
        setHasStartedReading(false);
        setIsPaused(false);
        setIsCodiMDTextUnmodified(false);
        resetMarkdownHook();
        window.history.pushState({}, "", window.location.pathname);
    };

    // ========================================
    // HANDLERS: Text & Speed
    // ========================================

    /**
     * Mise à jour du texte
     * v3.7.0 : Invalidation du lien CodiMD si le texte est modifié
     */
    const handleTextChange = (newText) => {
        setAppState((prev) => ({ ...prev, text: newText }));

        // Si on a un texte CodiMD et qu'il est modifié
        if (isCodiMDTextUnmodified && markdown && newText !== markdown) {
            setIsCodiMDTextUnmodified(false);
            console.log("⚠️ Texte modifié, le lien CodiMD n'est plus valide");
        }
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

    // Handler pour options d'affichage
    /**
     * Gère les changements d'options d'affichage (police, taille)
     */
    const handleDisplayOptionsChange = (options) => {
        setOptionsAffichage(options);
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
                            <svg
                                className="h-6 w-6 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-semibold text-red-800">
                                Erreur de chargement
                            </h3>
                            <p className="text-red-700 mt-2">{error}</p>
                            <button
                                onClick={reset}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Réessayer
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
            <div className="container mx-auto p-4 relative">
                <div className="max-w-6xl mx-auto">
                    {/* Bouton aide en haut à droite */}
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

                    <HelpModal
                        isOpen={showHelp}
                        onClose={() => setShowHelp(false)}
                    />

                    {/* Titre de l'étape */}
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <span className="text-4xl">📖</span>
                            Mode Lecture
                        </h2>
                    </div>

                    {/* Bouton démarrer (avant le début) */}
                    {!hasStartedReading && (
                        <div className="flex justify-center mb-6">
                            <button
                                onClick={handleStartReading}
                                className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-xl focus:outline-none focus:ring-4 focus:ring-green-300"
                                aria-label="Démarrer la lecture"
                            >
                                ▶️ Démarrer la lecture
                            </button>
                        </div>
                    )}

                    {/* Contrôles pendant la lecture */}
                    {hasStartedReading && (
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
                        optionsAffichage={optionsAffichage}
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
                    sourceUrl={isCodiMDTextUnmodified ? sourceUrl : null}
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
                                aria-label="Ouvrir le réglage de vitesse personnalisé"
                            >
                                ⚙️ Réglage personnalisé
                            </button>
                        )}

                        {/* Bouton Partage */}
                        {sourceUrl && isCodiMDTextUnmodified && (
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
                                aria-label="Générer un lien de partage"
                            >
                                🔗 Partager
                            </button>
                        )}
                    </>
                )}
            >
                <SpeedSelector
                    selectedSpeed={appState.speedWpm}
                    onSpeedChange={handleSpeedChange}
                    speedConfig={speedConfig}
                    showCustomModal={showCustomModal}
                    setShowCustomModal={setShowCustomModal}
                    showShareModal={showShareModal}
                    setShowShareModal={setShowShareModal}
                    sourceUrl={sourceUrl}
                    onDisplayOptionsChange={handleDisplayOptionsChange}
                />

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                    {!speedConfig && (
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                        >
                            ← Changer le texte
                        </button>
                    )}

                    <button
                        onClick={handleNextStep}
                        disabled={!appState.speedWpm}
                        className={`px-6 py-3 rounded-lg transition font-bold ${
                            !speedConfig ? "ml-auto" : ""
                        } ${
                            appState.speedWpm
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Suivant : Lancer la lecture →
                    </button>
                </div>
            </StepContainer>
        </div>
    );
}

export default LectureFlash;
