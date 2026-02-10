/**
 * Composant principal de l'application Lecture Flash
 * VERSION 3.0.0 : Workflow en 4 étapes
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
import initialState from "./initialState";
import { mode } from "./parametres.js";
import { useMarkdownFromUrl } from "../../hooks/useMarkdownFromUrl";

function LectureFlash() {
    // ========================================
    // STATE
    // ========================================
    const [step, setStep] = useState(1); // Étape actuelle (1-4)
    const [state, setState] = useState(initialState);
    const [isAutoStarting, setIsAutoStarting] = useState(false);

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

        // CAS 1 : locked=true → Skip direct vers étape 4 (auto-start)
        if (speedConfig?.locked) {
            setStep(4);
            setIsAutoStarting(true);
            setTimeout(() => {
                switchModeLecture(speedConfig.speed);
                setIsAutoStarting(false);
            }, 2000);
        }
        // CAS 2 : locked=false → Skip vers étape 2 (choix vitesse)
        else if (speedConfig && !speedConfig.locked) {
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
        setStep(1); // Retour à l'étape 1
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
        // Depuis étape 2 : aller à 3 si sourceUrl existe, sinon à 4
        if (step === 2) {
            setStep(sourceUrl ? 3 : 4);
        } else {
            setStep(step + 1);
        }
    };

    const goToPreviousStep = () => {
        // Depuis étape 3 : toujours retourner à 2
        if (step === 3) {
            setStep(2);
        }
        // Depuis étape 4 : retourner à 3 si sourceUrl existe, sinon à 2
        else if (step === 4) {
            setStep(sourceUrl ? 3 : 2);
        }
        // Sinon : étape précédente normale
        else {
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
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* HEADER */}
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    📖 Lecture Flash
                </h1>

                {/* INDICATEUR DE PROGRESSION */}
                <StepIndicator
                    currentStep={step}
                    totalSteps={4}
                    stepLabels={["Texte", "Vitesse", "Partage", "Lecture"]}
                />

                {/* ÉTAPE 1 : CHARGER LE TEXTE */}
                <StepContainer
                    step={1}
                    currentStep={step}
                    title="1️⃣ Charger ou saisir le texte"
                >
                    <TextInputManager
                        texte={state.texte}
                        onTexteChange={changeTexte}
                        onUrlSubmit={loadMarkdownFromUrl}
                        loading={loading}
                        error={error}
                        sourceUrl={sourceUrl}
                        onReset={handleReset}
                        speedConfig={speedConfig}
                    />

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={goToNextStep}
                            disabled={!state.texte.trim()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-md"
                        >
                            Suivant : Choisir la vitesse →
                        </button>
                    </div>
                </StepContainer>

                {/* ÉTAPE 2 : CHOISIR LA VITESSE */}
                <StepContainer
                    step={2}
                    currentStep={step}
                    title="2️⃣ Choisir la vitesse de lecture"
                >
                    <ChoixVitesseAmeliore
                        choisirVitesse={handleSpeedSelected}
                        texte={state.texte}
                        speedConfig={speedConfig}
                    />

                    <div className="mt-6 flex justify-between">
                        <button
                            onClick={goToPreviousStep}
                            className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition shadow-md"
                        >
                            ← Retour
                        </button>
                        <button
                            onClick={goToNextStep}
                            disabled={!state.vitesse}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-md"
                        >
                            {sourceUrl
                                ? "Suivant : Partager →"
                                : "Suivant : Lire →"}
                        </button>
                    </div>
                </StepContainer>

                {/* ÉTAPE 3 : PARTAGER (seulement si sourceUrl) */}
                {sourceUrl && (
                    <StepContainer
                        step={3}
                        currentStep={step}
                        title="3️⃣ Partager avec les élèves (optionnel)"
                    >
                        <ShareConfiguration
                            sourceUrl={sourceUrl}
                            vitesse={state.vitesse}
                        />

                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={goToPreviousStep}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition shadow-md"
                            >
                                ← Retour
                            </button>
                            <button
                                onClick={goToNextStep}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
                            >
                                Passer au mode lecture →
                            </button>
                        </div>
                    </StepContainer>
                )}

                {/* ÉTAPE 4 : LIRE */}
                <StepContainer
                    step={4}
                    currentStep={step}
                    title="4️⃣ Prêt pour la lecture !"
                >
                    {isAutoStarting ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-xl font-semibold text-gray-700">
                                🔒 Configuration automatique...
                            </p>
                            <p className="text-gray-600 mt-2">
                                La lecture va démarrer dans 2 secondes
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="mb-6">
                                <p className="text-xl text-gray-700 mb-2">
                                    ✅ Texte chargé :{" "}
                                    <strong>
                                        {state.texte.split(" ").length}
                                    </strong>{" "}
                                    mots
                                </p>
                                <p className="text-xl text-gray-700">
                                    ⚡ Vitesse :{" "}
                                    <strong>{state.vitesse}</strong> MLM
                                </p>
                            </div>

                            <button
                                onClick={() => startReading(state.vitesse)}
                                className="px-8 py-4 bg-green-600 text-white text-xl rounded-lg font-bold hover:bg-green-700 transition shadow-lg"
                            >
                                ▶️ Démarrer la lecture
                            </button>

                            <div className="mt-6">
                                <button
                                    onClick={goToPreviousStep}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition shadow-md"
                                >
                                    ← Retour
                                </button>
                            </div>
                        </div>
                    )}
                </StepContainer>
            </div>
        </div>
    );
}

export default LectureFlash;
