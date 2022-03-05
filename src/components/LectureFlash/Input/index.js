import React from "react";

import Consignes from "./Consignes";
import Choix from "./Choix";
import ImportExport from "./ImportExport";

function Input({ texte, changeTexte, switchMode }) {
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
            <Choix choisirVitesse={switchFlash} />
            <ImportExport texte={texte} changeTexte={changeTexte} />
            <textarea
                className="form-control border border-primary"
                rows="15"
                onChange={handleChange}
                value={texte}
                placeholder="Écrivez ou collez le texte ici."
            ></textarea>
        </div>
    );
}

export default Input;
