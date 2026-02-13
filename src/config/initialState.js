/**
 * État initial de l'application Lecture Flash
 *
 * @module config/initialState
 */

import { MODES, DEFAULT_TEXT } from "./constants.js";

/**
 * Configuration par défaut de l'application
 * @type {Object}
 */
export default {
    /** Mode de démarrage (INPUT ou READING) */
    mode: MODES.INPUT,

    /** Vitesse de lecture par défaut en MLM (Mots Lus par Minute) */
    speedWpm: 50,

    /** Texte de démonstration par défaut */
    text: DEFAULT_TEXT,
};
