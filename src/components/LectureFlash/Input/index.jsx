/**
 * Text input and reading‑speed selection component
 * VERSION 3.0.0 : Full speedConfig support (locked/unlocked)
 *
 * @component
 * @param {Object} props
 * @param {string} props.text - Current text
 * @param {Function} props.onTextChange - Callback to modify the text
 * @param {Function} props.onSwitchMode - Callback to switch to reading mode with a speed
 * @param {Function} props.onUrlSubmit - Callback to load CodiMD URL
 * @param {boolean} props.loading - CodiMD loading state
 * @param {string} props.error - CodiMD error message
 * @param {string} props.sourceUrl - CodiMD source URL
 * @param {Function} props.onReset - Callback to reset
 * @param {Object} props.speedConfig - Speed config from URL { speed: number, locked: boolean }
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import SpeedSelector from "../Flash/SpeedSelector";
import TextInputManager from "./TextInputManager";
import HelpModal from "../../HelpModal";
import FirstTimeMessage from "../../FirstTimeMessage";
import Tooltip from "../../Tooltip";

/**
 * Returns the grade level label corresponding to a speed
 * @param {number} speed - Speed in MLM
 * @returns {string} Grade level
 */
const getSpeedLevelLabel = (speed) => {
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
    text,
    onTextChange,
    onSwitchMode,
    onUrlSubmit,
    loading,
    error,
    sourceUrl,
    onReset,
    speedConfig,
}) {
    // State for help modal visibility
    const [showHelp, setShowHelp] = useState(false);

    /**
     * Handler that triggers the switch to reading mode
     * @param {number} selectedSpeed - Selected speed
     */
    const handleSpeedSelected = (selectedSpeed) => {
        onSwitchMode(selectedSpeed);
    };

    // ========================================
    // DISPLAY CONDITIONS
    // ========================================
    const showSuggestedSpeedMessage = speedConfig && !speedConfig.locked;
    const showLockedMessage = speedConfig?.locked;

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-8 px-4">
            {/* First‑time message */}
            <FirstTimeMessage />

            {/* Main container */}
            <div className="w-full max-w-5xl">
                {/* Header with title and help button */}
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

                {/* Text input / import zone */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <TextInputManager
                        text={text}
                        onTextChange={onTextChange}
                        onUrlSubmit={onUrlSubmit}
                        loading={loading}
                        error={error}
                        sourceUrl={sourceUrl}
                        onReset={onReset}
                        speedConfig={speedConfig}
                    />
                </div>

                {/* Message for suggested speed (locked = false) */}
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
                                        ({getSpeedLevelLabel(speedConfig.speed)}
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

                {/* Message for locked speed (locked = true) */}
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
                                {getSpeedLevelLabel(speedConfig.speed)}
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

                {/* Speed selector (hidden if locked = true) */}
                {!showLockedMessage && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            ⚡ Choisissez la vitesse de lecture
                        </h2>
                        <SpeedSelector
                            onSpeedChange={handleSpeedSelected}
                            text={text}
                            speedConfig={speedConfig}
                        />
                    </div>
                )}
            </div>

            {/* Help modal */}
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        </div>
    );
}

Input.propTypes = {
    text: PropTypes.string.isRequired,
    onTextChange: PropTypes.func.isRequired,
    onSwitchMode: PropTypes.func.isRequired,
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
