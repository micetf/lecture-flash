import React, { useRef } from "react";

import Consignes from "./Consignes";
import Choix from "./Choix";
import Svg, { DOWNLOAD, UPLOAD } from "../../Svg/index.js";

function Input({ texte, onTexteChange, onSwitchFlash }) {
    const refInputFile = useRef(null);
    const refTextarea = useRef(null);

    function handleChange(e) {
        e.preventDefault();
        onTexteChange(e.target.value);
    }
    const switchFlash = (e, n) => {
        e.preventDefault();
        onSwitchFlash(n);
    };
    function handleClickImport(e) {
        e.preventDefault();
        refInputFile.current.click();
        refInputFile.current.addEventListener("change", (e) => {
            e.preventDefault();
            const files = e.target.files;
            if (files && files[0].type.match("text/plain")) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    onTexteChange(event.target.result);
                };
                reader.readAsText(files[0]);
            }
        });
    }
    function handleClickExport(e) {
        e.preventDefault();
        const element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8, " +
                encodeURIComponent(refTextarea.current.value.trim())
        );
        element.setAttribute("download", "lecture-flach.txt");
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    return (
        <div className="form-group text-center">
            <Consignes />
            <Choix onChoix={switchFlash} />
            <div className="input-group mb-2">
                <button
                    className="btn btn-primary"
                    title="Importer un texte enregistré sur votre ordinateur."
                    onClick={handleClickImport}
                >
                    <span className="mr-1">Importer</span>
                    <Svg src={UPLOAD} />
                </button>
                <input
                    className="form-control invisible"
                    type="file"
                    ref={refInputFile}
                />
                <button
                    className="btn btn-primary"
                    title="Enregistrer le texte ci-dessous sur votre ordinateur."
                    onClick={handleClickExport}
                >
                    <span className="mr-1">Exporter</span>
                    <Svg src={DOWNLOAD} />
                </button>
            </div>
            <textarea
                ref={refTextarea}
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
