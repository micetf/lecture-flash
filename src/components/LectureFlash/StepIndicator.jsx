/**
 * Indicateur visuel de progression du workflow en 4 étapes
 *
 * Affiche : [●○○○] avec labels et état actuel
 * - Étape active : bleu
 * - Étapes passées : vert avec ✓
 * - Étapes futures : gris
 *
 * @component
 * @param {Object} props
 * @param {number} props.currentStep - Étape actuelle (1-4)
 * @param {number} props.totalSteps - Nombre total d'étapes (4)
 * @param {string[]} props.stepLabels - Labels des étapes
 */

import React from "react";
import PropTypes from "prop-types";

function StepIndicator({ currentStep, totalSteps, stepLabels }) {
    return (
        <div className="flex items-center justify-center gap-4 mb-8 px-4">
            {stepLabels.map((label, index) => {
                const stepNumber = index + 1;
                const isPast = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;
                const isFuture = stepNumber > currentStep;

                return (
                    <div key={index} className="flex items-center gap-2">
                        {/* Cercle numéroté */}
                        <div
                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center 
                                font-bold text-sm transition-all duration-300
                                ${isCurrent && "bg-blue-600 text-white scale-110 shadow-lg"}
                                ${isPast && "bg-green-500 text-white"}
                                ${isFuture && "bg-gray-300 text-gray-600"}
                            `}
                        >
                            {isPast ? "✓" : stepNumber}
                        </div>

                        {/* Label de l'étape */}
                        <span
                            className={`
                                text-sm font-medium hidden sm:inline
                                ${isCurrent && "text-blue-700 font-bold"}
                                ${isPast && "text-green-700"}
                                ${isFuture && "text-gray-500"}
                            `}
                        >
                            {label}
                        </span>

                        {/* Séparateur (sauf dernière étape) */}
                        {index < totalSteps - 1 && (
                            <div
                                className={`
                                    w-8 h-1 mx-2 transition-all duration-300
                                    ${isPast ? "bg-green-500" : "bg-gray-300"}
                                `}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

StepIndicator.propTypes = {
    currentStep: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
    stepLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default StepIndicator;
