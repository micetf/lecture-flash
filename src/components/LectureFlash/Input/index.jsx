/**
 * Composant de saisie de texte et choix de vitesse
 * VERSION COMPLÈTE : Avec aide contextuelle et message de bienvenue
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

import React, { useState } from "react";
import PropTypes from "prop-types";
import ChoixVitesseAmeliore from "../Flash/ChoixVitesseAmeliore";
import TextInputManager from "./TextInputManager";
import HelpModal from "../../HelpModal";
import FirstTimeMessage from "../../FirstTimeMessage";
import Tooltip from "../../Tooltip";

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
    // État pour gérer l'affichage de la modale d'aide
    const [showHelp, setShowHelp] = useState(false);

    /**
     * Handler qui déclenche le passage en mode lecture
     * @param {number} vitesse - Vitesse sélectionnée
     */
    const handleSpeedSelected = (vitesse) => {
        switchMode(vitesse);
    };

    return (
        <div className="space-y-6 relative">
            {/* Bouton d'aide en haut à droite avec Tooltip */}
            <div className="absolute top-0 right-0 z-10">
                <Tooltip content="Afficher l'aide complète" position="bottom">
                    <button
                        onClick={() => setShowHelp(true)}
                        className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition shadow-sm"
                        aria-label="Afficher l'aide"
                    >
                        <span className="text-xl font-bold">?</span>
                    </button>
                </Tooltip>
            </div>

            {/* Message de première visite (s'affiche automatiquement) */}
            <FirstTimeMessage />

            {/* Composant de gestion du texte */}
            <TextInputManager
                texte={texte}
                onTexteChange={changeTexte}
                onUrlSubmit={onUrlSubmit}
                loading={loading}
                error={error}
                sourceUrl={sourceUrl}
                onReset={onReset}
            />

            {/* Composant de choix de vitesse */}
            <ChoixVitesseAmeliore
                choisirVitesse={handleSpeedSelected}
                texte={texte}
            />

            {/* Modale d'aide */}
            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
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
