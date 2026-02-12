/**
 * Wrapper pour chaque étape du workflow
 * VERSION 3.6.0 : Enrichi avec icon et renderActions pour personnalisation
 *
 * Affiche conditionnellement le contenu selon l'étape active
 * Encapsule chaque étape dans une carte avec titre uniforme
 *
 * @component
 * @param {Object} props
 * @param {number} props.step - Numéro de cette étape
 * @param {number} props.currentStep - Étape actuellement active
 * @param {string} props.title - Titre de l'étape
 * @param {string} [props.icon] - Icône optionnelle à gauche du titre (ex: "⚡")
 * @param {Function} [props.renderActions] - Fonction retournant des boutons/actions à droite
 * @param {React.ReactNode} props.children - Contenu de l'étape
 */

import React from "react";
import PropTypes from "prop-types";

function StepContainer({
    step,
    currentStep,
    title,
    icon,
    renderActions,
    children,
}) {
    // N'affiche que si c'est l'étape active
    if (step !== currentStep) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-fadeIn">
            {/* Titre avec style uniforme pour toutes les étapes */}
            {title && (
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-3 flex items-center justify-between flex-wrap gap-3">
                    <span className="flex items-center gap-2">
                        {icon && <span>{icon}</span>}
                        {title}
                    </span>

                    {renderActions && (
                        <div className="flex gap-2">{renderActions()}</div>
                    )}
                </h2>
            )}

            {/* Contenu de l'étape */}
            <div>{children}</div>
        </div>
    );
}

StepContainer.propTypes = {
    step: PropTypes.number.isRequired,
    currentStep: PropTypes.number.isRequired,
    title: PropTypes.string,
    icon: PropTypes.string,
    renderActions: PropTypes.func,
    children: PropTypes.node.isRequired,
};

export default StepContainer;
