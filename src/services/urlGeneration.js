/**
 * Service de génération d'URLs de partage pour Lecture Flash
 *
 * Fournit des fonctions pour créer des liens de partage avec
 * configuration de texte et vitesse (suggérée ou imposée).
 *
 * @module services/urlGeneration
 * @version 3.9.0
 */

/**
 * Génère une URL de partage complète avec paramètres
 *
 * Format : ?url={sourceUrl}&speed={vitesseMLM}&locked={true|false}
 *
 * @param {string} urlSource - URL du document CodiMD source
 * @param {number} vitesseMLM - Vitesse de lecture en MLM
 * @param {boolean} [estVerrouillee=false] - Si true, vitesse imposée (lecture directe)
 * @returns {string} URL complète de partage
 *
 * @example
 * // Vitesse suggérée (modifiable par l'élève)
 * const url = generateShareUrl(
 *   "https://codimd.apps.education.fr/s/abc123",
 *   70,
 *   false
 * );
 * // Retourne : "https://lectureflash.fr/?url=...&speed=70&locked=false"
 *
 * @example
 * // Vitesse imposée (lecture automatique)
 * const url = generateShareUrl(
 *   "https://codimd.apps.education.fr/s/abc123",
 *   50,
 *   true
 * );
 * // Retourne : "https://lectureflash.fr/?url=...&speed=50&locked=true"
 */
export function generateShareUrl(
    urlSource,
    vitesseMLM,
    estVerrouillee = false
) {
    if (!urlSource || !vitesseMLM) {
        throw new Error("URL source et vitesse sont obligatoires");
    }

    // Créer les paramètres URL
    const parametres = new URLSearchParams({
        url: urlSource,
        speed: vitesseMLM.toString(),
        locked: estVerrouillee ? "true" : "false",
    });

    // Construire l'URL complète
    const urlBase = `${window.location.origin}${window.location.pathname}`;
    const urlComplete = `${urlBase}?${parametres.toString()}`;

    return urlComplete;
}

/**
 * Parse les paramètres d'URL pour extraire la configuration de partage
 *
 * @param {string} [urlString] - URL à parser (défaut : URL courante)
 * @returns {Object|null} Configuration extraite ou null si absente
 *
 * Structure de retour :
 * {
 *   urlSource: string,
 *   vitesse: number,
 *   estVerrouillee: boolean
 * }
 *
 * @example
 * // URL : ?url=https://codimd.../s/abc&speed=70&locked=false
 * const config = parseShareUrl();
 * // Retourne : {
 * //   urlSource: "https://codimd.../s/abc",
 * //   vitesse: 70,
 * //   estVerrouillee: false
 * // }
 */
export function parseShareUrl(urlString) {
    try {
        const url = urlString
            ? new URL(urlString)
            : new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        const urlSource = params.get("url");
        const vitesse = params.get("speed");
        const locked = params.get("locked");

        // Si les paramètres minimaux ne sont pas présents
        if (!urlSource || !vitesse) {
            return null;
        }

        return {
            urlSource: urlSource,
            vitesse: parseInt(vitesse, 10),
            estVerrouillee: locked === "true",
        };
    } catch (error) {
        console.error("Erreur lors du parsing de l'URL:", error);
        return null;
    }
}

/**
 * Copie un texte dans le presse-papier
 * Utilise l'API Clipboard moderne avec fallback vers execCommand
 *
 * @param {string} texte - Texte à copier
 * @returns {Promise<boolean>} true si copie réussie, false sinon
 *
 * @example
 * const success = await copyToClipboard("https://lectureflash.fr/?url=...");
 * if (success) {
 *   console.log("✅ Lien copié !");
 * }
 */
export async function copyToClipboard(texte) {
    if (!texte) {
        return false;
    }

    // Méthode 1 : API Clipboard moderne (navigateurs récents)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(texte);
            return true;
        } catch (error) {
            console.warn("Échec API Clipboard, tentative fallback:", error);
            // Continue vers le fallback
        }
    }

    // Méthode 2 : Fallback avec textarea + execCommand (navigateurs anciens)
    try {
        const textarea = document.createElement("textarea");
        textarea.value = texte;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";

        document.body.appendChild(textarea);
        textarea.select();

        const reussi = document.execCommand("copy");
        document.body.removeChild(textarea);

        return reussi;
    } catch (error) {
        console.error("Échec de la copie dans le presse-papier:", error);
        return false;
    }
}

/**
 * Valide qu'une URL de partage est correctement formée
 *
 * @param {string} url - URL à valider
 * @returns {boolean} true si l'URL est valide
 *
 * @example
 * isValidShareUrl("https://lectureflash.fr/?url=...&speed=70&locked=false");
 * // Retourne : true
 *
 * @example
 * isValidShareUrl("https://lectureflash.fr/?speed=70");
 * // Retourne : false (manque le paramètre url)
 */
export function isValidShareUrl(url) {
    try {
        const parsedUrl = new URL(url);
        const params = new URLSearchParams(parsedUrl.search);

        const hasUrl = params.has("url") && params.get("url").trim() !== "";
        const hasSpeed =
            params.has("speed") && !isNaN(parseInt(params.get("speed"), 10));
        const hasLocked =
            params.has("locked") &&
            ["true", "false"].includes(params.get("locked"));

        return hasUrl && hasSpeed && hasLocked;
    } catch (error) {
        return false;
    }
}

/**
 * Raccourcit une URL pour l'affichage
 * Utile pour afficher une URL longue dans une UI limitée
 *
 * @param {string} url - URL à raccourcir
 * @param {number} [longueurMax=50] - Longueur maximale
 * @returns {string} URL raccourcie avec "..." au milieu
 *
 * @example
 * shortenUrl("https://codimd.apps.education.fr/s/abc123def456", 30);
 * // Retourne : "https://codimd...def456"
 */
export function shortenUrl(url, longueurMax = 50) {
    if (!url || url.length <= longueurMax) {
        return url;
    }

    const debut = Math.floor(longueurMax / 2) - 2;
    const fin = Math.floor(longueurMax / 2) - 2;

    return url.substring(0, debut) + "..." + url.substring(url.length - fin);
}

/**
 * Extrait le domaine d'une URL
 *
 * @param {string} url - URL complète
 * @returns {string|null} Nom de domaine ou null si invalide
 *
 * @example
 * extractDomain("https://codimd.apps.education.fr/s/abc123");
 * // Retourne : "codimd.apps.education.fr"
 */
export function extractDomain(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname;
    } catch (error) {
        return null;
    }
}
