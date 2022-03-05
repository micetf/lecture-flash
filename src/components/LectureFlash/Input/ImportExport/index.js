import React, { useRef } from "react";
import Svg, { DOWNLOAD, UPLOAD } from "../../../Svg";

function index({ texte, changeTexte }) {
    const refInputFile = useRef(null);

    function handleClickImport(e) {
        e.preventDefault();
        refInputFile.current.click();
        refInputFile.current.addEventListener("change", (e) => {
            e.preventDefault();
            const files = e.target.files;
            if (files && files[0].type.match("text/plain")) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    changeTexte(event.target.result);
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
            "data:text/plain;charset=utf-8," + encodeURIComponent(texte.trim())
        );
        element.setAttribute("download", "lecture-flash.txt");
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    return (
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
                <span className="mr-1">Enregistrer</span>
                <Svg src={DOWNLOAD} />
            </button>
        </div>
    );
}

export default index;
