/**
 * Composant principal de l'application Lecture Flash
 * VERSION 3.9.10 : Intégration complète options affichage + plein écran
 *
 * Modifications v3.9.10 (Sprint 16-17) :
 * - Ajout state optionsAffichage (police, taille)
 * - Transmission options vers TextAnimation
 * - Intégration FullscreenButton dans contrôles lecture
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
import FullscreenButton from "./Flash/FullscreenButton";
import initialState from "../../config/initialState";
import { STEP_LABELS, TOTAL_STEPS } from "../../config/constants";
import { useMarkdownFromUrl } from "../../hooks/useMarkdownFromUrl";
import useFullscreen from "../../hooks/useFullscreen";

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

    // État pour tracker si le texte actuel vient de CodiMD sans modification
    const [isCodiMDTextUnmodified, setIsCodiMDTextUnmodified] = useState(false);

    // Options d'affichage (police et taille)
    const [optionsAffichage, setOptionsAffichage] = useState({
        police: "default",
        taille: 100,
    });

    // ========================================
    // URL PARAMS & CODIMD LOADING
    // ========================================

    // Extraction des paramètres URL
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get("url");
    const speedParam = params.get("speed");
    const lockedParam = params.get("locked");

    // Configuration vitesse si présente dans URL
    const speedConfig =
        speedParam && lockedParam
            ? {
                  speed: parseInt(speedParam),
                  locked: lockedParam === "true",
              }
            : null;

    // Hook de chargement CodiMD
    const {
        text: markdownText,
        loading,
        error,
        sourceUrl,
        loadMarkdownFromUrl,
        reset,
    } = useMarkdownFromUrl();

    const { sortirPleinEcran, estPleinEcran } = useFullscreen();

    /**
     * Effet 1 : Chargement automatique si URL présente SANS speedConfig
     * (Scénario : enseignant prépare un texte pour lui-même)
     */
    useEffect(() => {
        if (urlParam && !speedConfig) {
            loadMarkdownFromUrl(urlParam);
        }
    }, [urlParam, speedConfig]);

    /**
     * Effet 2 : Chargement automatique + passage étape 3 si speedConfig présent
     * (Scénario : élève clique sur lien partagé avec vitesse configurée)
     */
    useEffect(() => {
        if (urlParam && speedConfig) {
            loadMarkdownFromUrl(urlParam);
        }
    }, [urlParam, speedConfig]);

    /**
     * Effet 3 : Application du texte CodiMD chargé
     */
    useEffect(() => {
        if (markdownText) {
            setAppState((prev) => ({ ...prev, text: markdownText }));
            setIsCodiMDTextUnmodified(true);
            setCurrentStep(2);

            // Si speedConfig présent, appliquer la vitesse et passer étape 3
            if (speedConfig) {
                setAppState((prev) => ({
                    ...prev,
                    speedWpm: speedConfig.speed,
                }));
                setCurrentStep(3);
            }
        }
    }, [markdownText, speedConfig]);

    // ========================================
    // HANDLERS
    // ========================================

    /**
     * Gère le changement de texte (saisie manuelle)
     */
    const handleTextChange = (newText) => {
        setAppState({ ...appState, text: newText });
        // Invalider le lien CodiMD si le texte est modifié
        if (isCodiMDTextUnmodified && newText !== markdownText) {
            setIsCodiMDTextUnmodified(false);
        }
    };

    /**
     * Gère le changement de vitesse
     */
    const handleSpeedChange = (speed) => {
        setAppState({ ...appState, speedWpm: speed });
    };

    /**
     * Gère les changements d'options d'affichage (police, taille)
     */
    const handleDisplayOptionsChange = (options) => {
        setOptionsAffichage(options);
    };

    /**
     * Navigation vers l'étape suivante
     */
    const handleNextStep = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1);
        }
    };

    /**
     * Navigation vers l'étape précédente
     */
    const handleBack = () => {
        // Sortir du plein écran si actif
        if (estPleinEcran) {
            sortirPleinEcran();
        }

        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    /**
     * Retour à l'étape précédente depuis la lecture
     */
    const handleBackToPreviousStep = () => {
        // Sortir du plein écran si actif
        if (estPleinEcran) {
            sortirPleinEcran();
        }

        setHasStartedReading(false);
        setIsPaused(false);
        setCurrentStep(2);
    };

    /**
     * Gère la fin de l'animation
     */
    const handleAnimationComplete = () => {
        setHasStartedReading(false);
    };

    /**
     * Pause/Reprise de la lecture
     */
    const handlePauseResume = () => {
        setIsPaused(!isPaused);
    };

    /**
     * Relecture depuis le début
     */
    const handleReplay = () => {
        setHasStartedReading(false);
        setIsPaused(false);
        setTimeout(() => {
            setHasStartedReading(true);
        }, 100);
    };

    // ========================================
    // RENDER: Reading Mode (Step 3)
    // ========================================

    if (currentStep === 3) {
        // Auto-démarrage uniquement si speedConfig.locked
        // MAIS PAS d'auto-start même si locked (décision UX v3.6.0)
        // L'utilisateur doit cliquer sur "Lancer la lecture"

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

                {/* First time message */}
                <FirstTimeMessage />

                {/* Step indicator */}
                <StepIndicator
                    currentStep={currentStep}
                    totalSteps={TOTAL_STEPS}
                    stepLabels={STEP_LABELS}
                />

                <div className="max-w-6xl mx-auto">
                    {/* Bouton de lancement */}
                    {!hasStartedReading && (
                        <div className="text-center mb-6">
                            <button
                                onClick={() => setHasStartedReading(true)}
                                className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-xl shadow-lg hover:shadow-xl"
                            >
                                ▶️ Lancer la lecture
                            </button>
                            <p className="text-gray-600 mt-4">
                                Vitesse configurée : {appState.speedWpm} MLM
                            </p>
                        </div>
                    )}

                    {/* Contrôles de lecture */}
                    {hasStartedReading && (
                        <div className="flex justify-center gap-3 mb-6">
                            <button
                                onClick={handlePauseResume}
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
                            {/* Bouton plein écran */}
                            <FullscreenButton />
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
                totalSteps={TOTAL_STEPS}
                stepLabels={STEP_LABELS}
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
