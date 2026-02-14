/**
 * Constantes globales de l'application Lecture Flash
 * Single source of truth pour tous les modes, vitesses, labels ET polices
 *
 * VERSION 3.9.16 : Correction guillemets FONT_FAMILIES (bug polices)
 *
 * @module config/constants
 */

/**
 * Modes de fonctionnement de l'application
 * @constant {Object}
 */
export const MODES = {
    /** Mode saisie/configuration de texte */
    INPUT: "INPUT",
    /** Mode lecture avec animation */
    READING: "READING",
};

/**
 * Vitesses de lecture disponibles
 * Basées sur les recommandations Eduscol pour l'école primaire
 *
 * @constant {Array<Object>}
 *
 * Correspondances officielles :
 * - Cycle 2 (CP-CE2) : 30-70 MLM (lecture à voix haute)
 * - Cycle 3 (CM1-CM2) : 90-110 MLM (lecture fluide)
 *
 * Source : Ministère de l'Éducation Nationale - Repères annuels de progression
 */
export const SPEEDS = [
    {
        value: 30,
        label: "30 MLM",
        level: "CP - début CE1",
        tooltip:
            "Idéal pour CP - début CE1 (déchiffrage en cours d'acquisition)",
        description: "Très lent - Apprentissage du décodage",
    },
    {
        value: 50,
        label: "50 MLM",
        level: "CE1",
        tooltip: "Recommandé pour CE1 (lecture mot à mot)",
        description: "Lent - Consolidation du décodage",
    },
    {
        value: 70,
        label: "70 MLM",
        level: "CE2",
        tooltip: "Adapté au CE2 (lecture par groupes de mots)",
        description: "Moyen - Lecture par groupe de mots",
    },
    {
        value: 90,
        label: "90 MLM",
        level: "CM1-CM2",
        tooltip: "Pour CM1-CM2 (lecture fluide)",
        description: "Rapide - Lecture fluide",
    },
    {
        value: 110,
        label: "110 MLM",
        level: "CM2 et +",
        tooltip: "Pour CM2 et + (lecture experte)",
        description: "Très rapide - Lecture experte",
    },
];

/**
 * Map des polices vers les font-family CSS
 * Source unique de vérité pour DisplayOptions et TextAnimation
 *
 * ⚠️ IMPORTANT : Utiliser guillemets SIMPLES pour les noms de polices
 * pour éviter conflits avec attribut HTML style=""
 *
 * @constant {Object}
 *
 * @example
 * import { FONT_FAMILIES } from '@config/constants';
 * const fontFamily = FONT_FAMILIES['opendyslexic'];
 * // Retourne : "'OpenDyslexic', sans-serif"
 */
export const FONT_FAMILIES = {
    default:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    opendyslexic: "'OpenDyslexic', sans-serif",
    arial: "Arial, Helvetica, sans-serif",
    "comic-sans": "'Comic Sans MS', 'Comic Sans', cursive",
};

/**
 * Options de police disponibles pour le sélecteur
 *
 * @constant {Array<Object>}
 */
export const OPTIONS_POLICE = [
    { value: "default", label: "Défaut (sans serif)" },
    { value: "opendyslexic", label: "OpenDyslexic" },
    { value: "arial", label: "Arial" },
    { value: "comic-sans", label: "Comic Sans MS" },
];

/**
 * Labels des étapes du workflow
 * @constant {Array<string>}
 */
export const STEP_LABELS = ["Texte", "Vitesse", "Lecture"];

/**
 * Nombre total d'étapes dans le workflow
 * @constant {number}
 */
export const TOTAL_STEPS = 3;

/**
 * Texte par défaut affiché lors de la première utilisation
 * @constant {string}
 */
export const DEFAULT_TEXT =
    "Il était une fois un ogre, un vrai géant, qui vivait tout seul. " +
    "Comme la plupart des ogres, il avait des dents pointues, une barbe piquante, " +
    "un nez énorme et un grand couteau. Il était toujours de mauvaise humeur et avait " +
    "toujours faim. Ce qu'il aimait le plus au monde, c'était de manger des enfants à " +
    "son petit déjeuner. Chaque jour, l'ogre venait en ville et attrapait quelques enfants.";

/**
 * Retourne le label du niveau scolaire correspondant à une vitesse
 * @param {number} speed - Vitesse en MLM
 * @returns {string} Niveau scolaire
 *
 * @example
 * getSpeedLevel(70) // "CE2"
 */
export function getSpeedLevel(speed) {
    const speedData = SPEEDS.find((s) => s.value === speed);
    return speedData ? speedData.level : "Personnalisé";
}

/**
 * Retourne le tooltip correspondant à une vitesse
 * @param {number} speed - Vitesse en MLM
 * @returns {string} Texte du tooltip
 *
 * @example
 * getSpeedTooltip(70) // "Adapté au CE2 (lecture par groupes de mots)"
 */
export function getSpeedTooltip(speed) {
    const speedData = SPEEDS.find((s) => s.value === speed);
    return speedData ? speedData.tooltip : "";
}

/**
 * Retourne le label complet d'une vitesse (ex: "70 MLM")
 * @param {number} speed - Vitesse en MLM
 * @returns {string} Label de la vitesse
 *
 * @example
 * getSpeedLabel(70) // "70 MLM"
 */
export function getSpeedLabel(speed) {
    const speedData = SPEEDS.find((s) => s.value === speed);
    return speedData ? speedData.label : `${speed} MLM`;
}

/**
 * Retourne la description complète d'une vitesse
 * @param {number} speed - Vitesse en MLM
 * @returns {string} Description
 *
 * @example
 * getSpeedDescription(70) // "Moyen - Lecture par groupe de mots"
 */
export function getSpeedDescription(speed) {
    const speedData = SPEEDS.find((s) => s.value === speed);
    return speedData ? speedData.description : "";
}
