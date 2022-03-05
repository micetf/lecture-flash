import rocket from "./svg/rocket.svg";
import airplane from "./svg/airplane.svg";
import formula from "./svg/formula.svg";
import motorbike from "./svg/motorbike.svg";
import car from "./svg/car.svg";
import scooter from "./svg/scooter.svg";
import bicycle from "./svg/bicycle.svg";
import roller from "./svg/roller.svg";
import trottinette from "./svg/trottinette.svg";

const croissant = (a, b) => a.mlm - b.mlm;
export const mlmsHauteVoix = {
    type: "à voix haute",
    mlms: [
        { mlm: 150, niveau: rocket },
        { mlm: 140, niveau: airplane },
        { mlm: 130, niveau: formula },
        { mlm: 120, niveau: motorbike },
        { mlm: 110, niveau: car },
        { mlm: 95, niveau: scooter },
        { mlm: 80, niveau: bicycle },
        { mlm: 65, niveau: roller },
        { mlm: 50, niveau: trottinette },
    ].sort(croissant),
};
export const mlmsSilencieuse = {
    type: "silencieuse",
    mlms: [
        { mlm: 300, niveau: rocket },
        { mlm: 280, niveau: airplane },
        { mlm: 260, niveau: formula },
        { mlm: 240, niveau: motorbike },
        { mlm: 220, niveau: car },
        { mlm: 200, niveau: scooter },
        { mlm: 180, niveau: bicycle },
        { mlm: 160, niveau: roller },
        { mlm: 140, niveau: trottinette },
    ].sort(croissant),
};
