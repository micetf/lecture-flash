/**
 * Visual workflow progression indicator for 4 steps
 *
 * Displays: [●○○○] with labels and current state
 * - Active step: blue
 * - Past steps: green with ✓
 * - Future steps: gray
 *
 * @component
 * @param {Object} props
 * @param {number} props.currentStep - Current step (1-4)
 * @param {number} props.totalSteps - Total number of steps (4)
 * @param {string[]} props.stepLabels - Step labels
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
                        {/* Numbered circle */}
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

                        {/* Step label */}
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

                        {/* Separator (except last step) */}
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
