import React, { useState } from "react";

import Input from "./Input";
import Flash from "./Flash";

function Tool() {
    const [state, setState] = useState({
        mode: "input",
        mclm: 50,
        texte:
            "Il était une fois un ogre, un vrai géant, qui vivait tout seul. Comme la plupart des ogres, il avait des dents pointues, une barbe piquante, un nez énorme et un grand couteau. Il était toujours de mauvaise humeur et avait toujours faim. Ce qu’il aimait le plus au monde, c’était de manger des enfants à son petit déjeuner. Chaque jour, l’ogre venait en ville et attrapait quelques enfants.",
    });

    const switchFlash = mclm => {
        setState({ ...state, mode: "flash", mclm });
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
