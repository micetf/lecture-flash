import React, { useState } from "react";

import Mot from "./Mot";

import Svg, { EDIT_PENCIL, PLAY } from "../../Svg";
const specialsBeforeIn = /(^-|«|') +/g;
const specialsAfterIn = / +(;|:|!|\?|»|')/g;
const specialsBeforeOut = /(^-|«)/g;
const specialsAfterOut = /(;|:|!|\?|»)/g;

const Flash = ({ texte, mclm, onSwitchInput }) => {
    const [idMot, setIdMot] = useState(undefined);
    const mots = texte
        .trim()
        .replace(/’/g, "'")
        .replace(/ +/g, " ")
        .replace(/\n+/g, " ")
        .replace(specialsAfterIn, "$1")
        .replace(specialsBeforeIn, "$1")
        .split(" ");
    const nbreMots = mots.length;

    const switchInput = e => {
        e.preventDefault();
        onSwitchInput();
    };
    const start = e => {
        e.preventDefault();
        setIdMot(0);
    };
    const suivant = () => {
        idMot === mots.length - 1 ? onSwitchInput() : setIdMot(idMot + 1);
    };
    return (
        <div className="container">
            <div className="btn-group my-2">
                <button
                    className="btn btn-primary mr-2"
                    onClick={switchInput}
                    title="Modifier le texte ou la vitesse de lecture."
                >
                    <Svg src={EDIT_PENCIL} />
                </button>
                {idMot === undefined && (
                    <button className="btn btn-success" onClick={start}>
                        <Svg src={PLAY} /> Commmencer la lecture à {mclm} MLM
                    </button>
                )}
            </div>
            <p className="texte border border-secondary p-3">
                {mots.map((mot, index) => {
                    const motClean = mot
                        .replace(specialsAfterOut, "\u00a0$1")
                        .replace(specialsBeforeOut, "$1 ");
                    return (
                        <Mot
                            key={index}
                            mot={motClean}
                            masque={
                                idMot !== undefined && idMot >= index
                                    ? `m${mclm}`
                                    : null
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
