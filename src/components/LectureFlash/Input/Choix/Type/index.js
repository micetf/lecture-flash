import React from "react";
import Svg from "../../../../Svg";

const vitesseButton = ({ vitesse, niveau }, choisirVitesse) => {
    function handleClick(e) {
        e.preventDefault();
        choisirVitesse(vitesse);
    }
    return (
        <button
            className="btn btn-secondary text-light my-1 mx-1"
            key={vitesse}
            onClick={handleClick}
            title={`Vitesse de lecture : environ ${vitesse} mots lus par minute.`}
        >
            <Svg src={niveau} height="2em" />
        </button>
    );
};
const TypeLecture = ({ choix, choisirVitesse }) => (
    <div className="btn-group btn-block my-auto">
        <span className="badge badge-pill badge-light my-auto">
            Lecture {choix.type} :
        </span>
        {choix.vitesses.map((vitesse) =>
            vitesseButton(vitesse, choisirVitesse)
        )}
    </div>
);

export default TypeLecture;
