import rocket from "./svg/rocket.svg";
import airplane from "./svg/airplane.svg";
import formula from "./svg/formula.svg";
import motorbike from "./svg/motorbike.svg";
import car from "./svg/car.svg";
import scooter from "./svg/scooter.svg";
import bicycle from "./svg/bicycle.svg";
import roller from "./svg/roller.svg";
import trottinette from "./svg/trottinette.svg";

const croissant = (a, b) => a.vitesse - b.vitesse;
export const vitessesHauteVoix = {
    type: "à voix haute",
    vitesses: [
        { vitesse: 150, niveau: rocket },
        { vitesse: 140, niveau: airplane },
        { vitesse: 130, niveau: formula },
        { vitesse: 120, niveau: motorbike },
        { vitesse: 110, niveau: car },
        { vitesse: 95, niveau: scooter },
        { vitesse: 80, niveau: bicycle },
        { vitesse: 65, niveau: roller },
        { vitesse: 50, niveau: trottinette },
    ].sort(croissant),
};
export const vitessesSilencieuse = {
    type: "silencieuse",
    vitesses: [
        { vitesse: 300, niveau: rocket },
        { vitesse: 280, niveau: airplane },
        { vitesse: 260, niveau: formula },
        { vitesse: 240, niveau: motorbike },
        { vitesse: 220, niveau: car },
        { vitesse: 200, niveau: scooter },
        { vitesse: 180, niveau: bicycle },
        { vitesse: 160, niveau: roller },
        { vitesse: 140, niveau: trottinette },
    ].sort(croissant),
};
