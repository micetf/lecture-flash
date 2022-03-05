import React from "react";

import Consignes from "./Consignes";
import Choix from "./Choix";

function Input({ texte, onTexteChange, onSwitchFlash }) {
    function handleChange(e) {
        e.preventDefault();
        onTexteChange(e.target.value);
    }
    const switchFlash = (e, n) => {
        e.preventDefault();
        onSwitchFlash(n);
    };
    return (
        <div className="form-group text-center">
            <Consignes />
            <Choix onChoix={switchFlash} />
            <textarea
                className="form-control border border-primary"
                rows="20"
                onChange={handleChange}
                value={texte}
                placeholder="Écrivez ou collez le texte ici."
            ></textarea>
        </div>
    );
}

export default Input;
