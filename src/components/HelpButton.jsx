/**
 * Composant bouton d'aide global
 *
 * Fonctionnalités :
 * - Bouton rond "?" pour ouvrir la modale d'aide complète
 * - Tooltip explicatif au survol
 * - Accessibilité complète (ARIA, navigation clavier)
 * - Design cohérent avec l'identité visuelle de l'application
 *
 * Utilisation :
 * - Actuellement affiché uniquement à l'étape 3 (lecture)
 * - Pourra être rendu à toutes les étapes en v3.10.0+
 *
 * Conformité :
 * - WCAG 2.1 AA (contraste, focus visible, ARIA)
 * - Principe charge cognitive minimale (Tricot) : aide disponible mais discrète
 *
 * @component
 *
 * @example
 * <HelpButton onClick={() => setShowHelp(true)} />
 */

import React from "react";
import PropTypes from "prop-types";
import Tooltip from "./Tooltip";

/**
 * Bouton d'aide rond avec icône "?"
 *
 * @param {Object} props
 * @param {Function} props.onClick - Fonction appelée au clic (ouvre HelpModal)
 */
function HelpButton({ onClick }) {
    return (
        <Tooltip content="Afficher l'aide complète" position="bottom">
            <button
                onClick={onClick}
                className="
                    w-10 h-10 
                    bg-blue-600 text-white 
                    rounded-full 
                    hover:bg-blue-700 
                    transition-colors duration-200
                    font-bold text-lg
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-500 
                    focus:ring-offset-2
                    shadow-md
                    hover:shadow-lg
                "
                aria-label="Afficher l'aide complète"
                type="button"
            >
                ?
            </button>
        </Tooltip>
    );
}

HelpButton.propTypes = {
    /**
     * Fonction appelée au clic sur le bouton
     * Ouvre généralement la modale HelpModal
     */
    onClick: PropTypes.func.isRequired,
};

export default HelpButton;
