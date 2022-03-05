import React, { useState } from "react";

import Input from "./Input";
import Flash from "./Flash";
import initialState from "./initialState";
import { mode } from "./parametres.js";

function LectureFlash() {
    const [state, setState] = useState(initialState);

    const switchModeLecture = (vitesse) => {
        setState({ ...state, mode: mode.LECTURE, vitesse });
    };
    const switchModeSaisie = () => {
        setState({ ...state, mode: mode.SAISIE });
    };
    const changeTexte = (texte) => {
        setState({ ...state, texte });
    };
    return (
        <div className="container">
            {state.mode === mode.SAISIE ? (
                <Input
                    texte={state.texte}
                    changeTexte={changeTexte}
                    switchMode={switchModeLecture}
                />
            ) : (
                <Flash {...state} switchMode={switchModeSaisie} />
            )}
        </div>
    );
}

export default LectureFlash;
