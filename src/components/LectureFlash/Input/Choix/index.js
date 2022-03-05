import React from "react";

import { vitessesHauteVoix, vitessesSilencieuse } from "./preferencesVitesse";
import TypeLecture from "./Type";

function Choix({ choisirVitesse }) {
    return (
        <div className="alert alert-secondary">
            <TypeLecture
                choix={vitessesHauteVoix}
                choisirVitesse={choisirVitesse}
            />
            <TypeLecture
                choix={vitessesSilencieuse}
                choisirVitesse={choisirVitesse}
            />
        </div>
    );
}

export default Choix;
