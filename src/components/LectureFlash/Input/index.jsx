import React from "react";
import PropTypes from "prop-types";
import Consignes from "./Consignes";
import ReadingSpeedSelector from "../../ReadingSpeedSelector";
import TextInputManager from "./TextInputManager";

function Input({
    texte,
    changeTexte,
    switchMode,
    onUrlSubmit, // ✅ Nouveau prop
    loading, // ✅ Nouveau prop
    error, // ✅ Nouveau prop
    sourceUrl, // ✅ Nouveau prop
    onReset, // ✅ Nouveau prop
}) {
    const switchFlash = (vitesse) => {
        switchMode(vitesse);
    };

    return (
        <div className="form-group text-center">
            <Consignes />

            <ReadingSpeedSelector
                onSpeedChange={switchFlash}
                defaultSpeed={160}
            />

            {/* ✅ Nouveau composant unifié */}
            <TextInputManager
                texte={texte}
                onTexteChange={changeTexte}
                onUrlSubmit={onUrlSubmit}
                loading={loading}
                error={error}
                sourceUrl={sourceUrl}
                onReset={onReset}
            />
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
};

export default Input;
