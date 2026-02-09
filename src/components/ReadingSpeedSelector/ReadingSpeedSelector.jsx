import { useState } from "react";
import PropTypes from "prop-types";
import { readingSpeeds } from "./speedsConfig";

/**
 * Composant de sélection de vitesse de lecture
 * Conforme au SRS v2.0.0 - Utilise Tailwind CSS
 *
 * @component
 * @param {Object} props - Props du composant
 * @param {Function} props.onSpeedChange - Callback appelé lors du changement de vitesse
 * @param {number} props.defaultSpeed - Vitesse par défaut en mots/min
 * @returns {JSX.Element} Sélecteur de vitesse
 *
 * @example
 * <ReadingSpeedSelector
 *   onSpeedChange={(speed) => console.log(speed)}
 *   defaultSpeed={160}
 * />
 */
const ReadingSpeedSelector = ({ onSpeedChange, defaultSpeed = 160 }) => {
    const [selectedSpeed, setSelectedSpeed] = useState(defaultSpeed);

    /**
     * Gère le changement de vitesse sélectionnée
     * @param {number} speed - Nouvelle vitesse en mots par minute
     */
    const handleSpeedChange = (speed) => {
        setSelectedSpeed(speed);
        if (onSpeedChange) {
            onSpeedChange(speed);
        }
    };

    /**
     * Rendu d'un bouton de sélection de vitesse
     * @param {Object} speedConfig - Configuration de la vitesse
     * @returns {JSX.Element} Bouton de sélection
     */
    const renderSpeedButton = (speedConfig) => {
        const { value, label, Icon } = speedConfig;
        const isSelected = selectedSpeed === value;

        return (
            <button
                key={value}
                type="button"
                onClick={() => handleSpeedChange(value)}
                className={`
          flex flex-col items-center justify-center gap-1
          px-3 py-2 rounded-lg
          transition-all duration-200 ease-in-out
          ${
              isSelected
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-102"
          }
          min-w-[80px] border-2
          ${isSelected ? "border-blue-700" : "border-transparent"}
        `}
                title={`Vitesse de lecture : environ ${value} mots lus par minute.`}
                aria-label={`Sélectionner vitesse ${value} mots par minute - ${label}`}
                aria-pressed={isSelected}
            >
                <Icon />
                <span className="text-xs font-semibold">{value} MLM</span>
            </button>
        );
    };

    /**
     * Rendu d'une section (lecture à voix haute ou silencieuse)
     * @param {string} type - Type de lecture
     * @param {Array} speeds - Tableau des configurations de vitesse
     * @returns {JSX.Element} Section de sélection
     */
    const renderSection = (type, speeds) => (
        <div className="mb-4 last:mb-0" key={type}>
            <div className="flex items-center gap-2 mb-3">
                <div
                    className={`w-1 h-6 rounded-full ${
                        type === "à voix haute"
                            ? "bg-green-500"
                            : "bg-purple-500"
                    }`}
                />
                <h3 className="text-base font-semibold text-gray-800">
                    Lecture {type}
                </h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {speeds.map(renderSpeedButton)}
            </div>
        </div>
    );

    return (
        <div className="bg-gray-100 rounded-xl shadow-md p-6 space-y-4">
            {/* En-tête */}
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Réglage de la vitesse de lecture
                </h2>
                <p className="text-sm text-gray-600">
                    Vitesse sélectionnée :
                    <span className="font-semibold text-blue-600 ml-1">
                        {selectedSpeed} MLM
                    </span>
                </p>
            </div>

            {/* Section Lecture à voix haute */}
            {renderSection("à voix haute", readingSpeeds.voiceReading)}

            {/* Séparateur */}
            <div className="border-t border-gray-300" />

            {/* Section Lecture silencieuse */}
            {renderSection("silencieuse", readingSpeeds.silentReading)}

            {/* Indicateur visuel de progression */}
            <div className="bg-gradient-to-r from-green-50 to-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Plus lent</span>
                    <span className="text-gray-600">Plus rapide</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 to-purple-600 transition-all duration-300 ease-out"
                        style={{
                            width: `${((selectedSpeed - 50) / (300 - 50)) * 100}%`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

ReadingSpeedSelector.propTypes = {
    /** Callback appelé lors du changement de vitesse */
    onSpeedChange: PropTypes.func,
    /** Vitesse par défaut en mots par minute (MLM) */
    defaultSpeed: PropTypes.oneOf([
        50,
        65,
        80,
        95,
        110,
        120,
        130,
        140,
        150, // Voix haute
        140,
        160,
        180,
        200,
        220,
        240,
        260,
        280,
        300, // Silencieuse
    ]),
};

export default ReadingSpeedSelector;
