/**
 * Composant de saisie de texte et choix de vitesse
 * VERSION FINALE - Utilise ChoixVitesseAmeliore (sans véhicules)
 *
 * @component
 * @param {Object} props
 * @param {string} props.texte - Texte actuel
 * @param {Function} props.changeTexte - Callback pour modifier le texte
 * @param {Function} props.switchMode - Callback pour passer en mode lecture avec vitesse
 * @param {Function} props.onUrlSubmit - Callback pour charger URL cloud
 * @param {boolean} props.loading - État de chargement cloud
 * @param {string} props.error - Message d'erreur cloud
 * @param {string} props.sourceUrl - URL source du texte cloud
 * @param {Function} props.onReset - Callback pour réinitialiser
 */

import React from "react";
import PropTypes from "prop-types";
import Consignes from "./Consignes";
import ChoixVitesseAmeliore from "../Flash/ChoixVitesseAmeliore"; // ← Design simple sans véhicules
import TextInputManager from "./TextInputManager";

function Input({
    texte,
    changeTexte,
    switchMode,
    onUrlSubmit,
    loading,
    error,
    sourceUrl,
    onReset,
}) {
    /**
     * Handler qui déclenche le passage en mode lecture
     * @param {number} vitesse - Vitesse sélectionnée
     */
    const handleSpeedSelected = (vitesse) => {
        console.log("🚀 Vitesse sélectionnée :", vitesse);
        switchMode(vitesse);
    };

    return (
        <div className="space-y-6">
            <Consignes />

            <TextInputManager
                texte={texte}
                onTexteChange={changeTexte}
                onUrlSubmit={onUrlSubmit}
                loading={loading}
                error={error}
                sourceUrl={sourceUrl}
                onReset={onReset}
            />

            <ChoixVitesseAmeliore
                choisirVitesse={handleSpeedSelected}
                texte={texte}
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
