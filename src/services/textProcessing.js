/**
 * Service de traitement de texte pour Lecture Flash
 *
 * Fournit des fonctions pures pour le traitement, la purification
 * et l'analyse du texte avec préservation des retours ligne.
 *
 * @module services/textProcessing
 * @version 3.9.0
 */

/**
 * Compte le nombre de mots dans un texte
 * Ignore les lignes vides et les espaces multiples
 *
 * @param {string} texte - Texte à analyser
 * @returns {number} Nombre de mots dans le texte
 *
 * @example
 * countWords("Bonjour le monde");
 * // Retourne : 3
 *
 * @example
 * countWords("Ligne 1\n\nLigne 2");
 * // Retourne : 4 (ignore les lignes vides)
 */
export function countWords(texte) {
    if (!texte || typeof texte !== "string") {
        return 0;
    }

    // Supprimer les lignes vides et les espaces multiples
    const textePropre = texte
        .split("\n")
        .map((ligne) => ligne.trim())
        .filter((ligne) => ligne.length > 0)
        .join(" ");

    // Compter les mots (séparés par des espaces)
    const mots = textePropre.split(/\s+/).filter((mot) => mot.length > 0);

    return mots.length;
}

/**
 * Purifie un texte en supprimant les caractères indésirables
 * tout en préservant les retours ligne essentiels
 *
 * @param {string} texte - Texte à purifier
 * @returns {string} Texte purifié
 *
 * @example
 * purifyText("Texte   avec\n\n\nespaces   multiples");
 * // Retourne : "Texte avec\n\nespaces multiples"
 */
export function purifyText(texte) {
    if (!texte || typeof texte !== "string") {
        return "";
    }

    return (
        texte
            // Normaliser les espaces en début/fin de chaque ligne
            .split("\n")
            .map((ligne) => ligne.trim())
            // Réduire les espaces multiples au sein d'une ligne
            .map((ligne) => ligne.replace(/\s+/g, " "))
            // Rejoindre les lignes avec un seul \n
            .join("\n")
            // Réduire les sauts de ligne multiples (max 2 consécutifs)
            .replace(/\n{3,}/g, "\n\n")
            // Supprimer les espaces en début et fin de texte
            .trim()
    );
}

/**
 * Parse un texte en préservant la structure des paragraphes
 * Retourne un tableau d'objets représentant chaque mot avec métadonnées
 *
 * @param {string} texte - Texte à analyser
 * @returns {Array<Object>} Tableau d'objets mot avec métadonnées
 *
 * Structure de retour :
 * [
 *   { mot: "Bonjour", index: 0, finDeLigne: false, finDeParagraphe: false },
 *   { mot: "monde", index: 1, finDeLigne: true, finDeParagraphe: false },
 *   { mot: "Nouveau", index: 2, finDeLigne: false, finDeParagraphe: false },
 *   { mot: "paragraphe", index: 3, finDeLigne: true, finDeParagraphe: true }
 * ]
 *
 * @example
 * const texte = "Première ligne\nDeuxième ligne\n\nNouveau paragraphe";
 * const mots = parseTextWithLineBreaks(texte);
 * // Retourne un tableau d'objets avec les métadonnées de structure
 */
export function parseTextWithLineBreaks(texte) {
    if (!texte || typeof texte !== "string") {
        return [];
    }

    const resultat = [];
    let indexGlobal = 0;

    // Séparer le texte en lignes
    const lignes = texte.split("\n");

    for (let indexLigne = 0; indexLigne < lignes.length; indexLigne++) {
        const ligne = lignes[indexLigne].trim();

        // Ignorer les lignes vides (elles marquent les fins de paragraphes)
        if (ligne.length === 0) {
            // Si la ligne précédente existe, marquer le dernier mot comme fin de paragraphe
            if (resultat.length > 0) {
                resultat[resultat.length - 1].finDeParagraphe = true;
            }
            continue;
        }

        // Extraire les mots de la ligne
        const motsDeLaLigne = ligne
            .split(/\s+/)
            .filter((mot) => mot.length > 0);

        for (let indexMot = 0; indexMot < motsDeLaLigne.length; indexMot++) {
            const mot = motsDeLaLigne[indexMot];
            const estDernierMotDeLaLigne =
                indexMot === motsDeLaLigne.length - 1;
            const estDerniereLigne = indexLigne === lignes.length - 1;

            // Vérifier si c'est une fin de paragraphe
            // (dernière ligne OU ligne suivante vide)
            const lignesSuivantes = lignes.slice(indexLigne + 1);
            const indexProchaineLigneNonVide = lignesSuivantes.findIndex(
                (l) => l.trim().length > 0
            );
            const ilYaUneLigneVideEntreDeuxLignes =
                indexProchaineLigneNonVide > 0;

            const finDeParagraphe =
                estDernierMotDeLaLigne &&
                (estDerniereLigne || ilYaUneLigneVideEntreDeuxLignes);

            resultat.push({
                mot: mot,
                index: indexGlobal,
                finDeLigne: estDernierMotDeLaLigne,
                finDeParagraphe: finDeParagraphe,
            });

            indexGlobal++;
        }
    }

    return resultat;
}

/**
 * Compte le nombre de caractères dans un texte (hors espaces)
 *
 * @param {string} texte - Texte à analyser
 * @returns {number} Nombre de caractères (sans les espaces)
 *
 * @example
 * countCharacters("Bonjour le monde");
 * // Retourne : 14
 */
export function countCharacters(texte) {
    if (!texte || typeof texte !== "string") {
        return 0;
    }

    return texte.replace(/\s/g, "").length;
}

/**
 * Extrait un extrait du texte (preview)
 *
 * @param {string} texte - Texte complet
 * @param {number} nombreMotsMax - Nombre maximum de mots dans l'extrait
 * @returns {string} Extrait du texte
 *
 * @example
 * extractPreview("Un texte très long avec beaucoup de mots", 3);
 * // Retourne : "Un texte très..."
 */
export function extractPreview(texte, nombreMotsMax = 10) {
    if (!texte || typeof texte !== "string") {
        return "";
    }

    const mots = texte.split(/\s+/).filter((mot) => mot.length > 0);

    if (mots.length <= nombreMotsMax) {
        return texte;
    }

    return mots.slice(0, nombreMotsMax).join(" ") + "...";
}

// src/services/textProcessing.js

/**
 * Exporte un texte au format .txt avec titre personnalisé
 */
export function exportText(titre, texte) {
    const blob = new Blob([texte], { type: "text/plain;charset=utf-8" });
    const nomFichier = slugify(titre) + ".txt";
    downloadFile(blob, nomFichier);
}

/**
 * Exporte un texte au format Markdown avec titre H1
 */
export function exportMarkdown(titre, texte) {
    const contenuMarkdown = `# ${titre}\n\n${texte}`;
    const blob = new Blob([contenuMarkdown], {
        type: "text/markdown;charset=utf-8",
    });
    const nomFichier = slugify(titre) + ".md";
    downloadFile(blob, nomFichier);
}

/**
 * Utilitaire de slugification
 */
function slugify(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Utilitaire de téléchargement
 */
function downloadFile(blob, nomFichier) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nomFichier;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
