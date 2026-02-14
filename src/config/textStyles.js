/**
 * Utilitaires pour le calcul des styles d'affichage du texte
 *
 * Centralise la logique de conversion police/taille → styles CSS
 * pour éviter duplication entre DisplayOptions et TextAnimation
 *
 * @module utils/textStyles
 * @version 3.9.14
 */

import { FONT_FAMILIES } from "@config/constants";

/**
 * Taille de base du texte en rem (équivalent text-3xl Tailwind)
 * @constant {number}
 */
const BASE_FONT_SIZE_REM = 3;

/**
 * Calcule les styles CSS dynamiques pour l'affichage du texte
 *
 * @param {string} police - Identifiant de police ('default', 'opendyslexic', 'arial', 'comic-sans')
 * @param {number} taille - Pourcentage de taille (100 = taille de base)
 * @returns {Object} Objet styles CSS avec fontFamily et fontSize
 *
 * @example
 * // Texte avec police OpenDyslexic à 150% de la taille de base
 * const styles = getTextStyles('opendyslexic', 150);
 * // Retourne : { fontFamily: '"OpenDyslexic", sans-serif', fontSize: '4.5rem' }
 *
 * @example
 * // Texte par défaut à taille normale
 * const styles = getTextStyles('default', 100);
 * // Retourne : { fontFamily: 'system-ui, ...', fontSize: '3rem' }
 */
export function getTextStyles(police = "default", taille = 100) {
    // Validation des paramètres
    const policeFinale = FONT_FAMILIES[police] ? police : "default";
    const tailleFinale = taille > 0 ? taille : 100;

    return {
        fontFamily: FONT_FAMILIES[policeFinale],
        fontSize: `${(tailleFinale / 100) * BASE_FONT_SIZE_REM}rem`,
    };
}

/**
 * Valide si une police est disponible
 *
 * @param {string} police - Identifiant de police à valider
 * @returns {boolean} true si la police existe dans FONT_FAMILIES
 *
 * @example
 * isValidFont('opendyslexic') // true
 * isValidFont('times-new-roman') // false
 */
export function isValidFont(police) {
    return police in FONT_FAMILIES;
}

/**
 * Valide si une taille est dans la plage acceptable
 *
 * @param {number} taille - Taille en pourcentage
 * @param {number} [min=100] - Taille minimale acceptable
 * @param {number} [max=200] - Taille maximale acceptable
 * @returns {boolean} true si la taille est dans la plage [min, max]
 *
 * @example
 * isValidSize(150) // true
 * isValidSize(250) // false (> 200)
 * isValidSize(50) // false (< 100)
 */
export function isValidSize(taille, min = 100, max = 200) {
    return typeof taille === "number" && taille >= min && taille <= max;
}
