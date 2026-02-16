/**
 * Valide un fichier texte (.txt ou .md)
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
    if (!fichier) {
        return {
            valide: false,
            erreur: "Aucun fichier fourni",
        };
    }

    const nom = fichier.name.toLowerCase();
    const extensionsAutorisees = [".txt", ".md"];

    const extensionValide = extensionsAutorisees.some((ext) =>
        nom.endsWith(ext)
    );

    if (!extensionValide) {
        return {
            valide: false,
            erreur: "Format invalide. Veuillez utiliser un fichier .txt ou .md",
        };
    }

    const TAILLE_MAX = 1024 * 1024; // 1 MB
    if (fichier.size > TAILLE_MAX) {
        return {
            valide: false,
            erreur: "Fichier trop volumineux (maximum 1 MB)",
        };
    }

    if (fichier.size === 0) {
        return {
            valide: false,
            erreur: "Le fichier est vide",
        };
    }

    if (fichier.type && !fichier.type.includes("text")) {
        console.warn(
            `Type MIME inattendu : ${fichier.type} (attendu : text/plain ou text/markdown)`
        );
    }

    return { valide: true };
}
