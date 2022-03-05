import React, { useState } from "react";

import Mot from "./Mot";
import Svg, { EDIT_PENCIL, PLAY } from "../../Svg";

const ESPACE_INSECABLE = "\u00a0";
const TIRET_INSECABLE = "\u2011";

const specialsBeforeIn = /(^-|«|') +/g;
const specialsAfterIn = / +(;|:|!|\?|»|')/g;
const specialsBeforeOut = /(^-|«)/g;
const specialsAfterOut = /(;|:|!|\?|»)/g;

const Flash = ({ texte, vitesse, switchMode }) => {
    const [idMot, setIdMot] = useState(undefined);
    const textePurify = texte
        .trim()
        .replace(/’/g, "'")
        .replace(/ +/g, " ")
        .replace(/\n+/g, " ")
        .replace(specialsAfterIn, "$1")
        .replace(specialsBeforeIn, "$1");
    const mots = textePurify.split(" ");
    const nbreMots = mots.length;
    const nbreCaracteres = textePurify.length;
    const speed =
        Math.floor(((nbreMots / vitesse) * 60000) / nbreCaracteres) - 10;

    const handleClickSwitch = (e) => {
        e.preventDefault();
        switchMode();
    };
    const handleClickStart = (e) => {
        e.preventDefault();
        setIdMot(0);
    };
    const suivant = () => {
        idMot === nbreMots - 1 ? switchMode() : setIdMot(idMot + 1);
    };
    return (
        <div className="container">
            <div className="btn-group my-2">
                <button
                    className="btn btn-primary mr-2"
                    onClick={handleClickSwitch}
                    title="Modifier le texte ou la vitesse de lecture."
                >
                    <Svg src={EDIT_PENCIL} />
                </button>
                {idMot === undefined && (
                    <button
                        className="btn btn-success"
                        onClick={handleClickStart}
                    >
                        <Svg src={PLAY} /> Commmencer la lecture à environ{" "}
                        {vitesse} vitesse
                    </button>
                )}
            </div>
            <p className="texte border border-secondary p-3">
                {mots.map((mot, index) => {
                    const motClean = mot
                        .replace(specialsAfterOut, `${ESPACE_INSECABLE}$1`)
                        .replace(specialsBeforeOut, `$1${ESPACE_INSECABLE}`)
                        .replace(/-/g, TIRET_INSECABLE);
                    return (
                        <Mot
                            key={index}
                            mot={motClean}
                            speed={
                                idMot !== undefined && idMot >= index
                                    ? speed
                                    : 0
                            }
                            suivant={suivant}
                        />
                    );
                })}
            </p>
        </div>
    );
};

export default Flash;
