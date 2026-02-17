/**
 * Utilitaires de partage par URL encodée
 *
 * Ce module gère l'encodage et le décodage de l'état de lecture
 * dans des paramètres URL compressés avec lz-string.
 *
 * Workflow :
 * 1. buildSharedReadingState() : Extrait état minimal depuis état complet
 * 2. encodeReadingStateToParam() : JSON → compression → URL-safe
 * 3. buildInlineShareUrl() : Génère URL complète avec garde-fous
 * 4. decodeReadingStateFromParam() : URL-safe → décompression → JSON → objet
 *
 * @module utils/urlSharing
 * @version 1.0.0
 */

import LZString from "lz-string";

// ========================================
// CONSTANTES
// ========================================

/**
 * Seuil maximum de longueur de texte pour partage encodé
 * Au-delà, utiliser le partage CodiMD/stockage
 * @constant {number}
 */
export const MAX_INLINE_TEXT_LENGTH = 2000;

/**
 * Version du format d'encodage (pour migrations futures)
 * @constant {number}
 */
const CURRENT_VERSION = 1;

/**
 * Limite de longueur d'URL totale (compatibilité navigateurs)
 * @constant {number}
 */
const MAX_URL_LENGTH = 2000;

// ========================================
// FONCTIONS DE CONVERSION
// ========================================

/**
 * Convertit la taille en pourcentage vers pixels
 * Formule : 3rem * (taille/100) * 16px/rem = 0.48 * taille
 *
 * @param {number} taillePercent - Taille en pourcentage (100-200)
 * @returns {number} Taille en pixels
 *
 * @example
 * convertTailleToPixels(100); // 48
 * convertTailleToPixels(150); // 72
 */
function convertTailleToPixels(taillePercent) {
    return Math.round(0.48 * taillePercent);
}

/**
 * Convertit la taille en pixels vers pourcentage
 * Formule inverse : taille% = fontSizePx / 0.48
 *
 * @param {number} fontSizePx - Taille en pixels
 * @returns {number} Taille en pourcentage
 *
 * @example
 * convertPixelsToTaille(48); // 100
 * convertPixelsToTaille(72); // 150
 */
function convertPixelsToTaille(fontSizePx) {
    return Math.round(fontSizePx / 0.48);
}

// ========================================
// ENCODAGE (Enseignant → URL)
// ========================================

/**
 * Construit l'objet d'état partagé minimal à partir de l'état complet
 *
 * @param {Object} appState - État complet de l'application
 * @param {string} appState.text - Texte à partager
 * @param {number} appState.speedWpm - Vitesse de lecture en MLM
 * @param {Object} optionsAffichage - Options d'affichage
 * @param {string} optionsAffichage.police - Police ("default"|"opendyslexic"|"arial"|"comic-sans")
 * @param {number} optionsAffichage.taille - Taille en % (100-200)
 * @param {string} [theme="light"] - Thème visuel ("light"|"dark"|"high-contrast")
 * @param {boolean} [allowStudentChanges=true] - Droit de modification élève
 * @returns {Object} État partagé minimal versionné
 *
 * @example
 * const state = buildSharedReadingState(
 *   { text: "Le chat mange.", speedWpm: 50 },
 *   { police: "default", taille: 100 },
 *   "light",
 *   true
 * );
 * // {
 * //   v: 1,
 * //   text: "Le chat mange.",
 * //   speedWpm: 50,
 * //   font: "default",
 * //   fontSizePx: 48,
 * //   theme: "light",
 * //   allowStudentChanges: true
 * // }
 */
export function buildSharedReadingState(
    appState,
    optionsAffichage,
    theme = "light",
    allowStudentChanges = true
) {
    return {
        v: CURRENT_VERSION,
        text: appState.text,
        speedWpm: appState.speedWpm,
        font: optionsAffichage.police,
        fontSizePx: convertTailleToPixels(optionsAffichage.taille),
        theme: theme,
        allowStudentChanges: allowStudentChanges,
    };
}

/**
 * Encode l'état partagé en paramètre URL compressé
 *
 * Pipeline : objet → JSON → compression LZ → base64 URL-safe
 *
 * @param {Object} sharedState - État partagé minimal (retour de buildSharedReadingState)
 * @returns {string} Chaîne compressée URL-safe
 * @throws {Error} Si la sérialisation échoue
 *
 * @example
 * const state = { v: 1, text: "Bonjour", speedWpm: 50, ... };
 * const param = encodeReadingStateToParam(state);
 * // "N4IgdghgtgpiBcIDKBXAzgFwgewHYgFsCmATgK..."
 */
export function encodeReadingStateToParam(sharedState) {
    try {
        const json = JSON.stringify(sharedState);
        const compressed = LZString.compressToEncodedURIComponent(json);
        return compressed;
    } catch (error) {
        throw new Error(`Échec encodage état partagé : ${error.message}`);
    }
}

/**
 * Construit l'URL complète de partage encodé avec garde-fous
 *
 * Vérifications :
 * - Texte non vide
 * - Texte < MAX_INLINE_TEXT_LENGTH
 * - URL finale < MAX_URL_LENGTH
 *
 * @param {string} baseReadingUrl - URL de base (ex: "https://example.com/lecture")
 * @param {Object} appState - État application complet
 * @param {Object} optionsAffichage - Options affichage
 * @param {string} [theme="light"] - Thème visuel
 * @param {boolean} [allowStudentChanges=true] - Droit modification élève
 * @returns {string|null} URL complète ou null si impossible
 *
 * @example
 * const url = buildInlineShareUrl(
 *   window.location.origin,
 *   { text: "Le chat mange.", speedWpm: 50 },
 *   { police: "default", taille: 100 }
 * );
 * // "https://example.com?s=N4IgdghgtgpiBcIDKBXAzgFwgewHYgFs..."
 *
 * @example
 * // Texte trop long → null
 * const url = buildInlineShareUrl(
 *   window.location.origin,
 *   { text: "A".repeat(3000), speedWpm: 50 },
 *   { police: "default", taille: 100 }
 * );
 * // null
 */
export function buildInlineShareUrl(
    baseReadingUrl,
    appState,
    optionsAffichage,
    theme = "light",
    allowStudentChanges = true
) {
    // Garde-fou 1 : Texte vide
    if (!appState.text || appState.text.trim().length === 0) {
        return null;
    }

    // Garde-fou 2 : Texte trop long
    if (appState.text.length > MAX_INLINE_TEXT_LENGTH) {
        return null;
    }

    try {
        // Construction état partagé
        const sharedState = buildSharedReadingState(
            appState,
            optionsAffichage,
            theme,
            allowStudentChanges
        );

        // Encodage
        const encodedParam = encodeReadingStateToParam(sharedState);

        // Construction URL
        const url = new URL(baseReadingUrl);
        url.searchParams.set("s", encodedParam);
        const finalUrl = url.toString();

        // Garde-fou 3 : URL totale trop longue
        if (finalUrl.length > MAX_URL_LENGTH) {
            return null;
        }

        return finalUrl;
    } catch (error) {
        console.error("Erreur génération URL encodée :", error);
        return null;
    }
}

// ========================================
// DÉCODAGE (URL → Élève)
// ========================================

/**
 * Décode le paramètre URL en état partagé
 *
 * Pipeline inverse : base64 URL-safe → décompression LZ → JSON → objet
 *
 * Validations :
 * - Décompression réussie
 * - JSON valide
 * - Champs obligatoires présents
 * - Version compatible
 *
 * @param {string} param - Paramètre 's' extrait de l'URL
 * @returns {Object|null} État partagé ou null si erreur
 *
 * @example
 * const state = decodeReadingStateFromParam("N4IgdghgtgpiBcIDKBXAzg...");
 * // {
 * //   v: 1,
 * //   text: "Le chat mange.",
 * //   speedWpm: 50,
 * //   font: "default",
 * //   fontSizePx: 48,
 * //   theme: "light",
 * //   allowStudentChanges: true
 * // }
 *
 * @example
 * // Param invalide → null
 * const state = decodeReadingStateFromParam("INVALID");
 * // null
 */
export function decodeReadingStateFromParam(param) {
    if (!param || typeof param !== "string") {
        return null;
    }

    try {
        // Décompression
        const decompressed = LZString.decompressFromEncodedURIComponent(param);
        if (!decompressed) {
            return null;
        }

        // Parsing JSON
        const state = JSON.parse(decompressed);

        // Validation champs obligatoires
        if (!state.text || typeof state.speedWpm !== "number") {
            return null;
        }

        // Validation version (future-proof)
        if (state.v !== CURRENT_VERSION) {
            console.warn(`Version état partagé non reconnue : ${state.v}`);
            // Pour l'instant, on accepte quand même
            // Migration possible ici dans futures versions
        }

        // Valeurs par défaut pour champs optionnels (rétrocompatibilité)
        return {
            v: state.v || CURRENT_VERSION,
            text: state.text,
            speedWpm: state.speedWpm,
            font: state.font || "default",
            fontSizePx: state.fontSizePx || 48,
            theme: state.theme || "light",
            allowStudentChanges: state.allowStudentChanges !== false, // true par défaut
        };
    } catch (error) {
        console.error("Erreur décodage URL encodée :", error);
        return null;
    }
}

/**
 * Convertit l'état partagé décodé en format compatible application
 *
 * Transformations :
 * - fontSizePx → taille en % pour optionsAffichage
 * - Séparation appState / optionsAffichage
 *
 * @param {Object} sharedState - État partagé décodé
 * @returns {Object} { appState, optionsAffichage, allowStudentChanges }
 *
 * @example
 * const decoded = decodeReadingStateFromParam("N4Igdghgtg...");
 * const { appState, optionsAffichage } = convertSharedStateToAppState(decoded);
 * // appState: { text: "...", speedWpm: 50 }
 * // optionsAffichage: { police: "default", taille: 100 }
 */
export function convertSharedStateToAppState(sharedState) {
    return {
        appState: {
            text: sharedState.text,
            speedWpm: sharedState.speedWpm,
        },
        optionsAffichage: {
            police: sharedState.font,
            taille: convertPixelsToTaille(sharedState.fontSizePx),
        },
        theme: sharedState.theme,
        allowStudentChanges: sharedState.allowStudentChanges,
    };
}
