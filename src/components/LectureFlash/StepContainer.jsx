/**
 * Wrapper pour chaque étape du workflow
 *
 * Affiche conditionnellement le contenu selon l'étape active
 * Encapsule chaque étape dans une carte avec titre
 *
 * @component
 * @param {Object} props
 * @param {number} props.step - Numéro de cette étape
 * @param {number} props.currentStep - Étape actuellement active
 * @param {string} props.title - Titre de l'étape
 * @param {React.ReactNode} props.children - Contenu de l'étape
 */

import React from "react";
import PropTypes from "prop-types";

function StepContainer({ step, currentStep, title, children }) {
    // N'affiche que si c'est l'étape active
    if (step !== currentStep) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-3">
                {title}
            </h2>
            <div>{children}</div>
        </div>
    );
}

StepContainer.propTypes = {
    step: PropTypes.number.isRequired,
    currentStep: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default StepContainer;
