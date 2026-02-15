/**
 * Service de calculs de vitesse de lecture pour Lecture Flash
 *
 * Fournit des fonctions pures pour calculer les vitesses d'animation,
 * déterminer les zones Eduscol et estimer les temps de lecture.
 *
 * @module services/speedCalculations
 * @version 3.12.1
 */

/**
 * Calcule la vitesse d'animation en millisecondes par caractère
 * basée sur la vitesse de lecture en Mots Lus par Minute (MLM)
 *
 * ⚠️ IMPORTANT : nombreCaracteres doit INCLURE les espaces car l'animation
 * du mot ET de l'espace se font séquentiellement (pas en parallèle).
 *
 * Formule : ((nombreMots / vitesseMLM) * 60000) / nombreCaracteres
 *
 * @param {number} nombreMots - Nombre total de mots dans le texte
 * @param {number} vitesseMLM - Vitesse de lecture en Mots Lus par Minute
 * @param {number} nombreCaracteres - Nombre total de caractères (AVEC espaces) 🔧
 * @returns {number} Durée en millisecondes pour afficher un caractère
 *
 * @example
 * // Texte de 50 mots à 50 MLM, 299 caractères (espaces inclus)
 * const vitesse = calculateAnimationSpeed(50, 50, 299);
 * // Retourne : 200 (ms par caractère)
 * // Temps total : 299 × 200 = 59800 ms ≈ 60s ✅
 *
 * @example
 * // Texte de 100 mots à 70 MLM, 550 caractères (espaces inclus)
 * const vitesse = calculateAnimationSpeed(100, 70, 550);
 * // Retourne : ~156 (ms par caractère)
 */
export function calculateAnimationSpeed(
    nombreMots,
    vitesseMLM,
    nombreCaracteres
) {
    if (!nombreMots || !vitesseMLM || !nombreCaracteres) {
        return 0;
    }

    if (vitesseMLM <= 0 || nombreCaracteres <= 0) {
        return 0;
    }

    // Temps total pour lire tous les mots (en ms)
    const tempsTotalMs = (nombreMots / vitesseMLM) * 60000;

    // Temps par caractère (arrondi à l'entier inférieur)
    const msParCaractere = Math.floor(tempsTotalMs / nombreCaracteres);

    return msParCaractere;
}

/**
 * Détermine la zone pédagogique Eduscol correspondant à une vitesse
 * Basé sur les repères officiels de l'Éducation Nationale
 *
 * @param {number} vitesseMLM - Vitesse en Mots Lus par Minute
 * @returns {string} Description de la zone Eduscol avec niveau scolaire
 *
 * @example
 * getEduscolZone(30); // "CP - début CE1 (déchiffrage)"
 * getEduscolZone(50); // "CE1 (lecture mot à mot)"
 * getEduscolZone(70); // "CE2 (lecture par groupes)"
 * getEduscolZone(90); // "CM1-CM2 (lecture fluide)"
 * getEduscolZone(120); // "CM2+ (lecture experte)"
 */
export function getEduscolZone(vitesseMLM) {
    if (vitesseMLM <= 40) {
        return "CP - début CE1 (déchiffrage)";
    }

    if (vitesseMLM <= 60) {
        return "CE1 (lecture mot à mot)";
    }

    if (vitesseMLM <= 80) {
        return "CE2 (lecture par groupes)";
    }

    if (vitesseMLM <= 100) {
        return "CM1-CM2 (lecture fluide)";
    }

    return "CM2+ (lecture experte)";
}

/**
 * Estime le temps de lecture total d'un texte
 *
 * @param {number} nombreMots - Nombre de mots dans le texte
 * @param {number} vitesseMLM - Vitesse de lecture en MLM
 * @returns {number} Temps de lecture en secondes
 *
 * @example
 * estimateReadingTime(100, 50);
 * // Retourne : 120 (2 minutes)
 *
 * @example
 * estimateReadingTime(150, 75);
 * // Retourne : 120 (2 minutes)
 */
export function estimateReadingTime(nombreMots, vitesseMLM) {
    if (!nombreMots || !vitesseMLM || vitesseMLM <= 0) {
        return 0;
    }

    // Temps en minutes puis conversion en secondes
    const tempsMinutes = nombreMots / vitesseMLM;
    const tempsSecondes = Math.ceil(tempsMinutes * 60);

    return tempsSecondes;
}

/**
 * Formate un temps de lecture en format lisible
 *
 * @param {number} secondes - Temps en secondes
 * @returns {string} Temps formaté (ex: "2 min 30 s" ou "45 s")
 *
 * @example
 * formatReadingTime(150);
 * // Retourne : "2 min 30 s"
 *
 * @example
 * formatReadingTime(45);
 * // Retourne : "45 s"
 *
 * @example
 * formatReadingTime(3600);
 * // Retourne : "1 h 0 min"
 */
export function formatReadingTime(secondes) {
    if (!secondes || secondes <= 0) {
        return "0 s";
    }

    const heures = Math.floor(secondes / 3600);
    const minutes = Math.floor((secondes % 3600) / 60);
    const sec = secondes % 60;

    const parts = [];

    if (heures > 0) {
        parts.push(`${heures} h`);
    }

    if (minutes > 0) {
        parts.push(`${minutes} min`);
    }

    if (sec > 0 && heures === 0) {
        // N'afficher les secondes que si < 1 heure
        parts.push(`${sec} s`);
    }

    return parts.join(" ") || "0 s";
}

/**
 * Obtient le niveau scolaire correspondant à une vitesse
 * Version simplifiée (juste le niveau)
 *
 * @param {number} vitesseMLM - Vitesse en MLM
 * @returns {string} Niveau scolaire court
 *
 * @example
 * getNiveauScolaire(30); // "CP - début CE1"
 * getNiveauScolaire(50); // "CE1"
 * getNiveauScolaire(70); // "CE2"
 * getNiveauScolaire(90); // "CM1-CM2"
 * getNiveauScolaire(120); // "CM2+"
 */
export function getNiveauScolaire(vitesseMLM) {
    if (vitesseMLM <= 40) {
        return "CP - début CE1";
    }

    if (vitesseMLM <= 60) {
        return "CE1";
    }

    if (vitesseMLM <= 80) {
        return "CE2";
    }

    if (vitesseMLM <= 100) {
        return "CM1-CM2";
    }

    return "CM2+";
}

/**
 * Valide qu'une vitesse est dans les limites acceptables
 *
 * @param {number} vitesseMLM - Vitesse à valider
 * @returns {boolean} true si la vitesse est valide (20-200 MLM)
 *
 * @example
 * isValidSpeed(50); // true
 * isValidSpeed(15); // false (trop lent)
 * isValidSpeed(250); // false (trop rapide)
 */
export function isValidSpeed(vitesseMLM) {
    return vitesseMLM >= 20 && vitesseMLM <= 200;
}

/**
 * Arrondit une vitesse au multiple de 5 le plus proche
 * Utile pour le curseur de vitesse personnalisée
 *
 * @param {number} vitesseMLM - Vitesse à arrondir
 * @returns {number} Vitesse arrondie au multiple de 5
 *
 * @example
 * roundToNearestFive(67); // 65
 * roundToNearestFive(73); // 75
 * roundToNearestFive(70); // 70
 */
export function roundToNearestFive(vitesseMLM) {
    return Math.round(vitesseMLM / 5) * 5;
}
