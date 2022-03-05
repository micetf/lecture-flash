import React from "react";
import Svg from "../../../../Svg";

const mlmButton = ({ mlm, niveau }, handleChoix) => (
    <button
        className="btn btn-secondary text-light my-1 mx-1"
        key={mlm}
        onClick={e => handleChoix(e, mlm)}
        title={`Vitesse de lecture : environ ${mlm} mots lus par minute.`}
    >
        <Svg src={niveau} height="2em" />
    </button>
);
const TypeLecture = ({ pref, handleChoix }) => (
    <div className="btn-group btn-block my-auto">
        <span className="badge badge-pill badge-light my-auto">
            Lecture {pref.type} :
        </span>
        {pref.mlms.map(mlm => mlmButton(mlm, handleChoix))}
    </div>
);

export default TypeLecture;
