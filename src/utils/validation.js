/**
 * Utilitaires de validation pour Lecture Flash
 *
 * Fournit des fonctions de validation pour URLs CodiMD,
 * fichiers texte, et autres données utilisateur.
 *
 * @module utils/validation
 * @version 3.9.0
 */

/**
 * Valide qu'une URL appartient à codimd.apps.education.fr
 *
 * @param {string} url - URL à valider
 * @returns {boolean} true si l'URL est valide
 *
 * @example
 * isValidCodiMDUrl("https://codimd.apps.education.fr/s/abc123");
 * // Retourne : true
 *
 * @example
 * isValidCodiMDUrl("https://google.com");
 * // Retourne : false
 *
 * @example
 * isValidCodiMDUrl("not-a-url");
 * // Retourne : false
 */
export function isValidCodiMDUrl(url) {
    if (!url || typeof url !== "string") {
        return false;
    }

    try {
        const urlAnalysee = new URL(url.trim());
        return urlAnalysee.hostname === "codimd.apps.education.fr";
    } catch {
        return false;
    }
}

/**
 * Valide un fichier texte (.txt)
 * Vérifie l'extension, la taille et le type MIME
 *
 * @param {File} fichier - Fichier à valider
 * @returns {{valide: boolean, erreur?: string}} Résultat de la validation
 *
 * @example
 * const file = new File(["contenu"], "texte.txt", { type: "text/plain" });
 * const resultat = validateTextFile(file);
 * // Retourne : { valide: true }
 *
 * @example
 * const file = new File(["contenu"], "document.pdf", { type: "application/pdf" });
 * const resultat = validateTextFile(file);
 * // Retourne : { valide: false, erreur: "Format invalide..." }
 */
export function validateTextFile(fichier) {
    // Vérifier que le fichier existe
    if (!fichier) {
        return {
            valide: false,
            erreur: "Aucun fichier fourni",
        };
    }

    // Vérifier l'extension du fichier
    if (!fichier.name.endsWith(".txt")) {
        return {
            valide: false,
            erreur: "Format invalide. Veuillez utiliser un fichier .txt",
        };
    }

    // Vérifier la taille du fichier (max 1 MB)
    const TAILLE_MAX = 1024 * 1024; // 1 MB en octets
    if (fichier.size > TAILLE_MAX) {
        return {
            valide: false,
            erreur: "Fichier trop volumineux (maximum 1 MB)",
        };
    }

    // Vérifier que le fichier n'est pas vide
    if (fichier.size === 0) {
        return {
            valide: false,
            erreur: "Le fichier est vide",
        };
    }

    // Vérifier le type MIME (optionnel, car pas toujours fiable)
    if (fichier.type && !fichier.type.includes("text")) {
        console.warn(
            `Type MIME inattendu : ${fichier.type} (attendu : text/plain)`
        );
        // On ne bloque pas car certains systèmes donnent un type vide ou incorrect
    }

    return { valide: true };
}

/**
 * Valide qu'un texte n'est pas vide
 *
 * @param {string} texte - Texte à valider
 * @returns {boolean} true si le texte contient au moins un caractère non-espace
 *
 * @example
 * isValidText("Bonjour");      // true
 * isValidText("   ");          // false
 * isValidText("");             // false
 * isValidText(null);           // false
 */
export function isValidText(texte) {
    if (!texte || typeof texte !== "string") {
        return false;
    }

    return texte.trim().length > 0;
}

/**
 * Valide qu'une vitesse de lecture est dans les limites acceptables
 *
 * @param {number} vitesseMLM - Vitesse en Mots Lus par Minute
 * @param {number} [min=20] - Vitesse minimale
 * @param {number} [max=200] - Vitesse maximale
 * @returns {boolean} true si la vitesse est valide
 *
 * @example
 * isValidSpeed(70);      // true
 * isValidSpeed(15);      // false (trop lent)
 * isValidSpeed(250);     // false (trop rapide)
 * isValidSpeed(30, 25, 100); // true (avec limites personnalisées)
 */
export function isValidSpeed(vitesseMLM, min = 20, max = 200) {
    if (typeof vitesseMLM !== "number" || isNaN(vitesseMLM)) {
        return false;
    }

    return vitesseMLM >= min && vitesseMLM <= max;
}

/**
 * Valide qu'une URL est bien formée (format général)
 *
 * @param {string} url - URL à valider
 * @returns {boolean} true si l'URL est valide
 *
 * @example
 * isValidUrl("https://example.com");           // true
 * isValidUrl("http://example.com/path?q=1");   // true
 * isValidUrl("not a url");                      // false
 * isValidUrl("example.com");                    // false (manque le protocole)
 */
export function isValidUrl(url) {
    if (!url || typeof url !== "string") {
        return false;
    }

    try {
        new URL(url.trim());
        return true;
    } catch {
        return false;
    }
}

/**
 * Valide qu'une URL utilise HTTPS (sécurisée)
 *
 * @param {string} url - URL à valider
 * @returns {boolean} true si l'URL utilise HTTPS
 *
 * @example
 * isSecureUrl("https://example.com");  // true
 * isSecureUrl("http://example.com");   // false
 */
export function isSecureUrl(url) {
    if (!isValidUrl(url)) {
        return false;
    }

    try {
        const urlAnalysee = new URL(url.trim());
        return urlAnalysee.protocol === "https:";
    } catch {
        return false;
    }
}

/**
 * Valide l'encodage d'un fichier texte
 * Tente de détecter si le fichier est en UTF-8
 *
 * @param {string} contenu - Contenu du fichier à valider
 * @returns {boolean} true si le contenu semble être en UTF-8 valide
 *
 * @example
 * isValidEncoding("Texte avec accents : é, è, à");  // true
 * isValidEncoding("Invalid UTF-8: \uFFFD");         // false potentiellement
 */
export function isValidEncoding(contenu) {
    if (!contenu || typeof contenu !== "string") {
        return false;
    }

    // Vérifier la présence de caractères de remplacement (�)
    // qui indiquent un problème d'encodage
    const aDesCaracteresRemplacement = contenu.includes("\uFFFD");

    return !aDesCaracteresRemplacement;
}

/**
 * Valide le nombre de mots dans un texte (min/max)
 *
 * @param {string} texte - Texte à valider
 * @param {number} [min=1] - Nombre minimum de mots
 * @param {number} [max=Infinity] - Nombre maximum de mots
 * @returns {{valide: boolean, nombreMots: number, erreur?: string}} Résultat
 *
 * @example
 * validateWordCount("Bonjour le monde", 1, 10);
 * // Retourne : { valide: true, nombreMots: 3 }
 *
 * @example
 * validateWordCount("Mot", 5, 100);
 * // Retourne : { valide: false, nombreMots: 1, erreur: "Le texte doit contenir au moins 5 mots" }
 */
export function validateWordCount(texte, min = 1, max = Infinity) {
    if (!texte || typeof texte !== "string") {
        return {
            valide: false,
            nombreMots: 0,
            erreur: "Texte invalide",
        };
    }

    // Compter les mots
    const mots = texte
        .trim()
        .split(/\s+/)
        .filter((mot) => mot.length > 0);

    const nombreMots = mots.length;

    // Vérifier le minimum
    if (nombreMots < min) {
        return {
            valide: false,
            nombreMots,
            erreur: `Le texte doit contenir au moins ${min} mot${min > 1 ? "s" : ""}`,
        };
    }

    // Vérifier le maximum
    if (nombreMots > max) {
        return {
            valide: false,
            nombreMots,
            erreur: `Le texte ne doit pas dépasser ${max} mots`,
        };
    }

    return { valide: true, nombreMots };
}

/**
 * Sanitize une chaîne de caractères pour éviter les injections
 * Échappe les caractères HTML dangereux
 *
 * @param {string} texte - Texte à nettoyer
 * @returns {string} Texte nettoyé
 *
 * @example
 * sanitizeString("<script>alert('XSS')</script>");
 * // Retourne : "&lt;script&gt;alert('XSS')&lt;/script&gt;"
 */
export function sanitizeString(texte) {
    if (!texte || typeof texte !== "string") {
        return "";
    }

    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&#x2F;",
    };

    return texte.replace(/[&<>"'/]/g, (char) => map[char]);
}
