/**
 * Composant principal de l'application Lecture Flash
 * VERSION 3.10.0 : Ajout partage par URL encodée (Sprint 1 complet)
 *
 * Corrections v3.10.0 (Sprint 1) :
 * - ✨ NOUVEAU : Import ShareModal (composant réutilisable)
 * - ✨ NOUVEAU : Import useInlineShareLink (hook partage encodé)
 * - ✨ NOUVEAU : Import copyToClipboard (service)
 * - ✨ NOUVEAU : States pour les deux types de partage (CodiMD + Encodé)
 * - ✨ NOUVEAU : Handlers handleCodiMDShare et handleInlineShare
 * - ✨ NOUVEAU : Deux boutons de partage dans renderActions
 * - ✨ NOUVEAU : Deux modales ShareModal (type="codimd" + type="inline")
 *
 * Corrections v3.10.3 :
 * - 🔧 Effets redondants supprimés (boucle infinie)
 * - 🔧 Séparation en 2 effets distincts avec garde hasLoadedFromUrl
 *
 * Corrections v3.9.11 :
 * - 🔧 Destructuring corrigé (markdown au lieu de text)
 * - 🔧 Remount TextInputManager pour nettoyage formulaire
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
import HelpButton from "../HelpButton";
import FullscreenButton from "./Flash/FullscreenButton";
import ShareModal from "./ShareModal";
import initialState from "../../config/initialState";
import { STEP_LABELS, TOTAL_STEPS } from "../../config/constants";
import useMarkdownFromUrl from "../../hooks/useMarkdownFromUrl";
import useFullscreen from "../../hooks/useFullscreen";
import useInlineShareLink from "../../hooks/useInlineShareLink";
import { copyToClipboard } from "../../services/urlGeneration";
import { decodeReadingStateFromParam } from "../../utils/urlSharing";

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

    // ✨ NOUVEAU : États partage CodiMD
    const [showShareCodiMDModal, setShowShareCodiMDModal] = useState(false);
    const [shareCodiMDLocked, setShareCodiMDLocked] = useState(false);
    const [showShareCodiMDSuccess, setShowShareCodiMDSuccess] = useState(false);

    // ✨ NOUVEAU : États partage Encodé
    const [showShareInlineModal, setShowShareInlineModal] = useState(false);
    const [shareInlineLocked, setShareInlineLocked] = useState(false);
    const [showShareInlineSuccess, setShowShareInlineSuccess] = useState(false);

    // État pour tracker si le texte actuel vient de CodiMD sans modification
    const [isCodiMDTextUnmodified, setIsCodiMDTextUnmodified] = useState(false);

    // Options d'affichage (police et taille)
    const [optionsAffichage, setOptionsAffichage] = useState({
        police: "default",
        taille: 100,
    });
    const [dynamicSpeedConfig, setDynamicSpeedConfig] = useState(null);
    // Key pour forcer remount de TextInputManager
    const [textInputKey, setTextInputKey] = useState(0);

    const [hasLoadedFromUrl, setHasLoadedFromUrl] = useState(false);

    // ========================================
    // URL PARAMS & CODIMD LOADING
    // ========================================

    // Extraction des paramètres URL
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get("url");
    const speedParam = params.get("speed");
    const lockedParam = params.get("locked");
    const policeParam = params.get("police");
    const tailleParam = params.get("taille");
    const encodedStateParam = params.get("s");

    // Configuration vitesse si présente dans URL
    const speedConfig =
        dynamicSpeedConfig ||
        (speedParam && lockedParam
            ? {
                  speed: parseInt(speedParam),
                  locked: lockedParam === "true",
              }
            : null);

    // Contexte pour HelpModal
    const isEleve = !!speedConfig;
    const role = isEleve ? "eleve" : "enseignant";

    const helpContent = {
        role,
        step: currentStep,
        isLocked: speedConfig?.locked || false,
    };

    // Hook de chargement CodiMD
    const {
        markdown: markdownText,
        loading,
        error,
        sourceUrl,
        loadMarkdownFromUrl,
        reset,
    } = useMarkdownFromUrl();

    const { sortirPleinEcran, estPleinEcran } = useFullscreen();

    // ✨ NOUVEAU : Hook partage encodé
    const { canShareInline, reasonIfNot } = useInlineShareLink(
        appState,
        optionsAffichage,
        "light",
        true
    );

    /**
     * Effet 1 : Application du texte CodiMD chargé
     */
    useEffect(() => {
        if (markdownText) {
            setAppState((prev) => ({ ...prev, text: markdownText }));
            setIsCodiMDTextUnmodified(true);
            setTextInputKey((prev) => prev + 1);
        }
    }, [markdownText]);

    /**
     * Effet 2 : Configuration automatique si speedConfig présent (UNE SEULE FOIS)
     */
    useEffect(() => {
        if (speedConfig && markdownText && !hasLoadedFromUrl) {
            setAppState((prev) => ({
                ...prev,
                speedWpm: speedConfig.speed,
            }));
            setCurrentStep(3);
            setHasLoadedFromUrl(true);

            // Appliquer police et taille depuis l'URL
            if (policeParam && tailleParam) {
                const newOptions = {
                    police: policeParam,
                    taille: parseInt(tailleParam, 10),
                };
                setOptionsAffichage(newOptions);

                // Forcer localStorage AVANT le render de DisplayOptions
                localStorage.setItem(
                    "lecture-flash-font-settings",
                    JSON.stringify(newOptions)
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [speedConfig, markdownText, policeParam, tailleParam, hasLoadedFromUrl]);

    /**
     * ✨ NOUVEAU Sprint 2 : Décodage du lien encodé
     * Applique l'état si paramètre 's' présent dans l'URL
     */
    useEffect(() => {
        if (encodedStateParam && !hasLoadedFromUrl) {
            try {
                const decodedState =
                    decodeReadingStateFromParam(encodedStateParam);

                if (decodedState) {
                    // Appliquer le texte et la vitesse
                    setAppState({
                        text: decodedState.text,
                        speedWpm: decodedState.speedWpm,
                    });

                    // Conversion fontSizePx → taille% (formule inverse)
                    const taillePourcent = Math.round(
                        decodedState.fontSizePx / 0.48
                    );

                    setOptionsAffichage({
                        police: decodedState.font,
                        taille: taillePourcent,
                    });

                    // Forcer localStorage pour DisplayOptions
                    localStorage.setItem(
                        "lecture-flash-font-settings",
                        JSON.stringify({
                            police: decodedState.font,
                            taille: taillePourcent,
                        })
                    );
                    setDynamicSpeedConfig({
                        speed: decodedState.speedWpm,
                        locked: !decodedState.allowStudentChanges, // locked = inverse de allowStudentChanges
                    });
                    // Passer directement à la lecture (étape 3)
                    setCurrentStep(3);
                    setHasLoadedFromUrl(true);
                }
            } catch (error) {
                console.error("Erreur décodage lien encodé:", error);
                alert(
                    "Le lien est invalide ou corrompu. " +
                        "Veuillez demander un nouveau lien à votre enseignant."
                );
            }
        }
    }, [encodedStateParam, hasLoadedFromUrl]);

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
            reset();
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
     * Arrêt de la lecture (retour à l'état initial)
     */
    const handleStop = () => {
        setHasStartedReading(false);
        setIsPaused(false);
    };

    // ========================================
    // ✨ NOUVEAUX HANDLERS PARTAGE
    // ========================================

    /**
     * Gère le partage CodiMD
     */
    const handleCodiMDShare = async () => {
        if (!sourceUrl || !appState.speedWpm) return;

        try {
            // Construction de l'URL avec tous les paramètres
            const params = new URLSearchParams({
                url: sourceUrl,
                speed: appState.speedWpm.toString(),
                locked: shareCodiMDLocked ? "true" : "false",
                police: optionsAffichage.police,
                taille: optionsAffichage.taille.toString(),
            });

            const baseUrl = `${window.location.origin}${window.location.pathname}/index.html`;
            const shareUrl = `${baseUrl}?${params.toString()}`;

            // Copie dans le presse-papier (service)
            const success = await copyToClipboard(shareUrl);

            if (success) {
                setShowShareCodiMDSuccess(true);
                setTimeout(() => setShowShareCodiMDSuccess(false), 3000);
            } else {
                alert("Impossible de copier : " + shareUrl);
            }
        } catch (error) {
            console.error("Erreur partage CodiMD:", error);
            alert("Erreur lors de la génération du lien.");
        }
    };

    /**
     * Gère le partage par URL encodée
     */
    const handleInlineShare = async () => {
        try {
            // Import dynamique du service
            const { buildInlineShareUrl } = await import(
                "../../utils/urlSharing"
            );

            const baseReadingUrl = `${window.location.origin}${window.location.pathname}/index.html`;

            const shareUrl = buildInlineShareUrl(
                baseReadingUrl,
                appState,
                optionsAffichage,
                "light",
                !shareInlineLocked // allowStudentChanges = inverse de locked
            );

            if (!shareUrl) {
                alert("Impossible de générer le lien encodé.");
                return;
            }

            // Copie dans le presse-papier (service)
            const success = await copyToClipboard(shareUrl);

            if (success) {
                setShowShareInlineSuccess(true);
                setTimeout(() => setShowShareInlineSuccess(false), 3000);
            } else {
                alert("Impossible de copier : " + shareUrl);
            }
        } catch (error) {
            console.error("Erreur partage encodé:", error);
            alert("Erreur lors de la génération du lien.");
        }
    };

    // ========================================
    // RENDER: Reading Mode (Step 3)
    // ========================================

    if (currentStep === 3) {
        return (
            <div className="container mx-auto p-4 relative">
                {/* Boutons utilitaires en haut à droite */}
                <div className="absolute top-0 right-0 z-10 flex gap-2 items-center">
                    <FullscreenButton />
                    <HelpButton onClick={() => setShowHelp(true)} />
                </div>

                {/* Help modal */}
                <HelpModal
                    isOpen={showHelp}
                    onClose={() => setShowHelp(false)}
                    context={helpContent}
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
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold text-xl shadow-lg hover:shadow-xl"
                            >
                                ▶️ Lancer la lecture ({appState.speedWpm} MLM)
                            </button>
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
                                onClick={handleStop}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold focus:outline-none focus:ring-4 focus:ring-red-300"
                                aria-label="Arrêter la lecture"
                            >
                                ⏹️ Arrêter
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
                                ← Modifier les réglages
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
            <HelpModal
                isOpen={showHelp}
                onClose={() => setShowHelp(false)}
                context={helpContent}
            />

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
                    key={textInputKey}
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

                        {/* Bouton Partage Encodé */}
                        {!speedConfig && canShareInline && (
                            <Tooltip content="Lien compressé • Textes courts (<2000 car.) • Partage rapide sans stockage externe">
                                <button
                                    onClick={() =>
                                        setShowShareInlineModal(true)
                                    }
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm"
                                >
                                    ⚡ Direct
                                </button>
                            </Tooltip>
                        )}

                        {/* Bouton Partage CodiMD */}
                        {!speedConfig &&
                            sourceUrl &&
                            isCodiMDTextUnmodified && (
                                <Tooltip content="Stockage CodiMD • Textes longs • Bibliothèque de lectures permanente">
                                    <button
                                        onClick={() =>
                                            setShowShareCodiMDModal(true)
                                        }
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
                                    >
                                        ☁️ CodiMD
                                    </button>
                                </Tooltip>
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
                    onDisplayOptionsChange={handleDisplayOptionsChange}
                    optionsAffichage={optionsAffichage}
                />

                {/* Navigation */}
                <div
                    className={`flex mt-6 ${
                        !speedConfig ? "justify-between" : "justify-end"
                    }`}
                >
                    {/* Bouton Changer le texte - masqué si speedConfig */}
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
                            appState.speedWpm
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Suivant : Lancer la lecture →
                    </button>
                </div>
            </StepContainer>

            {/* ======================================== */}
            {/* ✨ MODALE PARTAGE CODIMD */}
            {/* ======================================== */}
            <ShareModal
                isOpen={showShareCodiMDModal}
                onClose={() => setShowShareCodiMDModal(false)}
                type="codimd"
                vitesse={appState.speedWpm}
                police={optionsAffichage.police}
                taille={optionsAffichage.taille}
                shareLocked={shareCodiMDLocked}
                setShareLocked={setShareCodiMDLocked}
                onGenerateLink={handleCodiMDShare}
                showSuccess={showShareCodiMDSuccess}
            />

            {/* ======================================== */}
            {/* ✨ MODALE PARTAGE ENCODÉ */}
            {/* ======================================== */}
            <ShareModal
                isOpen={showShareInlineModal}
                onClose={() => setShowShareInlineModal(false)}
                type="inline"
                vitesse={appState.speedWpm}
                police={optionsAffichage.police}
                taille={optionsAffichage.taille}
                texteLength={appState.text.length}
                shareLocked={shareInlineLocked}
                setShareLocked={setShareInlineLocked}
                onGenerateLink={handleInlineShare}
                showSuccess={showShareInlineSuccess}
            />
        </div>
    );
}

export default LectureFlash;
