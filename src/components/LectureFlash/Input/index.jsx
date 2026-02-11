/**
 * Composant de saisie de texte et choix de vitesse
 * VERSION 3.0.0 : Support complet speedConfig (locked/unlocked)
 *
 * @component
 * @param {Object} props
 * @param {string} props.texte - Texte actuel
 * @param {Function} props.changeTexte - Callback pour modifier le texte
 * @param {Function} props.switchMode - Callback pour passer en mode lecture avec vitesse
 * @param {Function} props.onUrlSubmit - Callback pour charger URL CodiMD
 * @param {boolean} props.loading - État de chargement CodiMD
 * @param {string} props.error - Message d'erreur CodiMD
 * @param {string} props.sourceUrl - URL source du texte CodiMD
 * @param {Function} props.onReset - Callback pour réinitialiser
 * @param {Object} props.speedConfig - Config vitesse depuis URL { speed: number, locked: boolean }
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import ChoixVitesse from "../Flash/ChoixVitesse";
import TextInputManager from "./TextInputManager";
import HelpModal from "../../HelpModal";
import FirstTimeMessage from "../../FirstTimeMessage";
import Tooltip from "../../Tooltip";

/**
 * Retourne le libellé du niveau scolaire correspondant à une vitesse
 * @param {number} speed - Vitesse en MLM
 * @returns {string} Niveau scolaire
 */
const getVitesseLevelLabel = (speed) => {
    const labels = {
        30: "CP - début CE1",
        50: "CE1",
        70: "CE2",
        90: "CM1-CM2",
        110: "CM2 et +",
    };
    return labels[speed] || "Personnalisé";
};

function Input({
    texte,
    changeTexte,
    switchMode,
    onUrlSubmit,
    loading,
    error,
    sourceUrl,
    onReset,
    speedConfig,
}) {
    // État pour gérer l'affichage de la modale d'aide
    const [showHelp, setShowHelp] = useState(false);

    /**
     * Handler qui déclenche le passage en mode lecture
     * @param {number} vitesse - Vitesse sélectionnée
     */
    const handleSpeedSelected = (vitesse) => {
        switchMode(vitesse);
    };

    // ========================================
    // CONDITIONS D'AFFICHAGE
    // ========================================
    const showSuggestedSpeedMessage = speedConfig && !speedConfig.locked;
    const showLockedMessage = speedConfig?.locked;

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-8 px-4">
            {/* Message de première visite */}
            <FirstTimeMessage />

            {/* Container principal */}
            <div className="w-full max-w-5xl">
                {/* Header avec titre et bouton aide */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        📖 Lecture Flash
                    </h1>
                    <Tooltip content="Aide et mode d'emploi" position="bottom">
                        <button
                            onClick={() => setShowHelp(true)}
                            className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition flex items-center justify-center font-bold text-lg"
                            aria-label="Afficher l'aide"
                        >
                            ?
                        </button>
                    </Tooltip>
                </div>

                {/* Zone de saisie / import */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <TextInputManager
                        texte={texte}
                        onTexteChange={changeTexte}
                        onUrlSubmit={onUrlSubmit}
                        loading={loading}
                        error={error}
                        sourceUrl={sourceUrl}
                        onReset={onReset}
                        speedConfig={speedConfig}
                    />
                </div>

                {/* Message vitesse suggérée (cas locked=false) */}
                {showSuggestedSpeedMessage && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <span className="text-2xl">💡</span>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                    Vitesse suggérée par votre enseignant
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>
                                        <strong className="text-lg">
                                            {speedConfig.speed} MLM
                                        </strong>{" "}
                                        (
                                        {getVitesseLevelLabel(
                                            speedConfig.speed
                                        )}
                                        )
                                    </p>
                                    <p className="mt-1 text-xs">
                                        Vous pouvez conserver cette vitesse ou
                                        en choisir une autre ci-dessous.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Message vitesse imposée (cas locked=true) */}
                {showLockedMessage && (
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-8 text-center shadow-md">
                        <div className="mb-4">
                            <span className="text-6xl">🔒</span>
                        </div>
                        <p className="text-xl font-semibold text-blue-800 mb-3">
                            Vitesse de lecture imposée par votre enseignant
                        </p>
                        <div className="bg-white rounded-lg p-4 mb-4 inline-block">
                            <p className="text-4xl font-bold text-blue-900 mb-1">
                                {speedConfig.speed} MLM
                            </p>
                            <p className="text-sm text-gray-600">
                                {getVitesseLevelLabel(speedConfig.speed)}
                            </p>
                        </div>
                        <p className="text-gray-600 animate-pulse flex items-center justify-center gap-2">
                            <span className="text-2xl">⏳</span>
                            <span>
                                La lecture va démarrer automatiquement...
                            </span>
                        </p>
                    </div>
                )}

                {/* Choix de vitesse (masqué si locked=true) */}
                {!showLockedMessage && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            ⚡ Choisissez la vitesse de lecture
                        </h2>
                        <ChoixVitesse
                            choisirVitesse={handleSpeedSelected}
                            texte={texte}
                            speedConfig={speedConfig}
                        />
                    </div>
                )}
            </div>

            {/* Modale d'aide */}
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        </div>
    );
}

Input.propTypes = {
    texte: PropTypes.string.isRequired,
    changeTexte: PropTypes.func.isRequired,
    switchMode: PropTypes.func.isRequired,
    onUrlSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    sourceUrl: PropTypes.string,
    onReset: PropTypes.func,
    speedConfig: PropTypes.shape({
        speed: PropTypes.number.isRequired,
        locked: PropTypes.bool.isRequired,
    }),
};

export default Input;
