import { useEffect } from "react";
import PropTypes from "prop-types";
import {
    ENSEIGNANT_ETAPE_1,
    ENSEIGNANT_ETAPE_2,
    ENSEIGNANT_ETAPE_3,
    ELEVE_LOCKED,
    ELEVE_UNLOCKED,
    FOOTER_CONTENT,
} from "@config/helpContent";

/**
 * Détermine le contenu à afficher selon le contexte
 * @param {Object} context - Contexte utilisateur
 * @returns {Object} Contenu adapté
 */
function getContextualContent(context) {
    const { role, step, isLocked } = context;

    // Cas ÉLÈVE
    if (role === "eleve") {
        return isLocked ? ELEVE_LOCKED : ELEVE_UNLOCKED;
    }

    // Cas ENSEIGNANT
    switch (step) {
        case 1:
            return ENSEIGNANT_ETAPE_1;
        case 2:
            return ENSEIGNANT_ETAPE_2;
        case 3:
            return ENSEIGNANT_ETAPE_3;
        default:
            // Par défaut, afficher toutes les étapes
            return {
                title: "Guide complet Lecture Flash",
                sections: [
                    ...ENSEIGNANT_ETAPE_1.sections,
                    ...ENSEIGNANT_ETAPE_2.sections,
                    ...ENSEIGNANT_ETAPE_3.sections,
                ],
            };
    }
}

/**
 * Modal d'aide contextuelle
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - État d'ouverture
 * @param {Function} props.onClose - Callback de fermeture
 * @param {Object} props.context - Contexte utilisateur
 * @param {string} props.context.role - 'enseignant' ou 'eleve'
 * @param {number} props.context.step - Étape courante (1, 2 ou 3)
 * @param {boolean} props.context.isLocked - Réglages verrouillés (élève seulement)
 */
function HelpModal({ isOpen, onClose, context = { helpContent } }) {
    // Valeurs par défaut si context non fourni
    const contextWithDefaults = {
        role: context.role || "enseignant",
        step: context.step || null,
        isLocked: context.isLocked || false,
    };

    const content = getContextualContent(contextWithDefaults);

    // Gestion fermeture Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Bloquer le scroll du body
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-modal-title"
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* En-tête */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2
                        id="help-modal-title"
                        className="text-2xl font-bold text-gray-800"
                    >
                        {content.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none transition-colors"
                        aria-label="Fermer l'aide"
                    >
                        ×
                    </button>
                </div>

                {/* Contenu scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {content.sections.map((section, index) => (
                            <div key={index} className="space-y-3">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                    <span className="text-2xl">
                                        {section.icon}
                                    </span>
                                    {section.title}
                                </h3>
                                <div className="text-gray-700 leading-relaxed">
                                    {section.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    {FOOTER_CONTENT}
                    <button
                        onClick={onClose}
                        className="mt-4 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                        J'ai compris
                    </button>
                </div>
            </div>
        </div>
    );
}

HelpModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    context: PropTypes.shape({
        role: PropTypes.oneOf(["enseignant", "eleve"]),
        step: PropTypes.oneOf([1, 2, 3, null]),
        isLocked: PropTypes.bool,
    }),
};

export default HelpModal;
