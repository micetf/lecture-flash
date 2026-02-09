import React from "react";
import Consignes from "./Consignes";
import Choix from "./Choix"; // Ancien système
import ImportExport from "./ImportExport";
import ReadingSpeedSelector from "../../ReadingSpeedSelector"; // Nouveau système

function Input({ texte, changeTexte, switchMode }) {
    // Flag pour basculer entre ancien et nouveau sélecteur
    const USE_NEW_SPEED_SELECTOR = true;

    function handleChange(e) {
        e.preventDefault();
        changeTexte(e.target.value);
    }

    const switchFlash = (vitesse) => {
        switchMode(vitesse);
    };

    return (
        <div className="form-group text-center">
            <Consignes />

            {/* Rendu conditionnel : nouveau ou ancien sélecteur */}
            {USE_NEW_SPEED_SELECTOR ? (
                <ReadingSpeedSelector
                    onSpeedChange={switchFlash}
                    defaultSpeed={160}
                />
            ) : (
                <Choix choisirVitesse={switchFlash} />
            )}

            <ImportExport texte={texte} changeTexte={changeTexte} />

            <textarea
                className="form-control border border-primary w-full rounded-lg p-4 mt-4 text-lg"
                rows="17"
                onChange={handleChange}
                value={texte}
                placeholder="Écrivez ou collez le texte ici."
            ></textarea>
        </div>
    );
}

export default Input;
