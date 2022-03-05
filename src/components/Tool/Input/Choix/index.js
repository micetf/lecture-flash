import React from "react";

import { mlmsHauteVoix, mlmsSilencieuse } from "./preferencesMLM";
import TypeLecture from "./Type";

function Choix({ onChoix }) {
    return (
        <div className="alert alert-secondary">
            <TypeLecture pref={mlmsHauteVoix} handleChoix={onChoix} />
            <TypeLecture pref={mlmsSilencieuse} handleChoix={onChoix} />
        </div>
    );
}

export default Choix;
