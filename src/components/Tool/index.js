import React, { useState } from "react";

import Input from "./Input";
import Flash from "./Flash";
import initialState from "./initialState";

function Tool() {
    const [state, setState] = useState(initialState);

    const switchFlash = mlm => {
        setState({ ...state, mode: "flash", mlm });
    };
    const switchInput = () => {
        setState({ ...state, mode: "input" });
    };
    const texteChange = texte => {
        setState({ ...state, texte });
    };
    return (
        <div className="container">
            {state.mode === "input" ? (
                <Input
                    texte={state.texte}
                    onTexteChange={texteChange}
                    onSwitchFlash={switchFlash}
                />
            ) : (
                <Flash {...state} onSwitchInput={switchInput} />
            )}
        </div>
    );
}

export default Tool;
