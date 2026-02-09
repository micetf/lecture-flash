/**
 * Configuration centralisée des vitesses de lecture
 * Conforme au SRS v2.0.0 - Section 3.3.2
 *
 * Vitesses basées sur les MLM (Mots Lus par Minute) :
 * - Lecture à voix haute : 50-150 MLM
 * - Lecture silencieuse : 140-300 MLM
 */
import Trottinette from "../LectureFlash/Input/Choix/svg/trottinette.svg";
import Roller from "../LectureFlash/Input/Choix/svg/roller.svg";
import Bicycle from "../LectureFlash/Input/Choix/svg/bicycle.svg";
import Scooter from "../LectureFlash/Input/Choix/svg/scooter.svg";
import Car from "../LectureFlash/Input/Choix/svg/car.svg";
import Motorbike from "../LectureFlash/Input/Choix/svg/motorbike.svg";
import Formula from "../LectureFlash/Input/Choix/svg/formula.svg";
import AirPlane from "../LectureFlash/Input/Choix/svg/airplane.svg";
import Rocket from "../LectureFlash/Input/Choix/svg/rocket.svg";

/**
 * Icône Trottinette (50 MLM - Très lent)
 */
export const TrottinetteIcon = () => (
    <img src={Trottinette} alt="Trottinette" />
);

/**
 * Icône Roller (65 MLM - Lent)
 */
export const RollerIcon = () => <img src={Roller} alt="Roller" />;

/**
 * Icône Vélo (80 MLM - Moyen-)
 */
export const BicycleIcon = () => <img src={Bicycle} alt="Bicycle" />;

/**
 * Icône Scooter (95 MLM - Moyen)
 */
export const ScooterIcon = () => <img src={Scooter} alt="Scooter" />;

/**
 * Icône Voiture (110-120 MLM - Moyen+/Rapide-)
 */
export const CarIcon = () => <img src={Car} alt="Car" />;

/**
 * Icône Moto (130 MLM - Rapide)
 */
export const MotorcycleIcon = () => <img src={Motorbike} alt="Motorbike" />;

/**
 * Icône Formule 1 (140 MLM - Très rapide)
 */
export const FormulaIcon = () => <img src={Formula} alt="Formula" />;

/**
 * Icône Avion (150 MLM voix haute, 260-280 silencieuse)
 */
export const AirplaneIcon = () => <img src={AirPlane} alt="AirPlane" />;

/**
 * Icône Fusée (150 MLM voix haute, 300 MLM silencieuse - Ultra rapide)
 */
export const RocketIcon = () => <img src={Rocket} alt="Rocket" />;

/**
 * Configuration complète des vitesses de lecture
 * Conforme au SRS v2.0.0 - Section 3.3.2
 */
export const readingSpeeds = {
    /**
     * Vitesses pour lecture à voix haute (50-150 MLM)
     */
    voiceReading: [
        { value: 50, label: "Très lent", Icon: TrottinetteIcon },
        { value: 65, label: "Lent", Icon: RollerIcon },
        { value: 80, label: "Moyen-", Icon: BicycleIcon },
        { value: 95, label: "Moyen", Icon: ScooterIcon },
        { value: 110, label: "Moyen+", Icon: CarIcon },
        { value: 120, label: "Rapide-", Icon: MotorcycleIcon },
        { value: 130, label: "Rapide", Icon: FormulaIcon },
        { value: 140, label: "Très rapide", Icon: AirplaneIcon },
        { value: 150, label: "Ultra rapide", Icon: RocketIcon },
    ],

    /**
     * Vitesses pour lecture silencieuse (140-300 MLM)
     */
    silentReading: [
        { value: 140, label: "Très lent", Icon: TrottinetteIcon },
        { value: 160, label: "Lent", Icon: RollerIcon },
        { value: 180, label: "Moyen-", Icon: BicycleIcon },
        { value: 200, label: "Moyen", Icon: ScooterIcon },
        { value: 220, label: "Moyen+", Icon: CarIcon },
        { value: 240, label: "Rapide-", Icon: MotorcycleIcon },
        { value: 260, label: "Rapide", Icon: FormulaIcon },
        { value: 280, label: "Très rapide", Icon: AirplaneIcon },
        { value: 300, label: "Ultra rapide", Icon: RocketIcon },
    ],
};
