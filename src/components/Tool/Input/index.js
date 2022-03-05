import React from "react";

import Consignes from "./Consignes";
import Choix from "./Choix";
import Svg, { DOWNLOAD, UPLOAD } from "../../Svg/index.js";

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
            <div className="input-group mb-2">
                <button
                    className="btn btn-primary"
                    title="Importer un texte enregistré sur votre ordinateur."
                >
                    <span className="mr-1">Importer</span>
                    <Svg src={UPLOAD} />
                </button>
                <input
                    className="form-control invisible"
                    type="file"
                    id="uploadText"
                />
                <button
                    className="btn btn-primary"
                    title="Enregistrer le texte ci-dessous sur votre ordinateur."
                >
                    <span className="mr-1">Exporter</span>
                    <Svg src={DOWNLOAD} />
                </button>
            </div>
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
