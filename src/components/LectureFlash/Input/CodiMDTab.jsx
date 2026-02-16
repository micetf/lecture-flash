/**
 * Onglet de chargement CodiMD
 *
 * Permet à l'utilisateur de charger un document depuis codimd.apps.education.fr
 * avec validation d'URL et exemples d'utilisation
 *
 * VERSION 3.10.0 : URLs d'exemples cliquables (UX amélioration Sprint 6)
 * VERSION 3.9.1 : Ajout bouton Réessayer dans message d'erreur
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onUrlSubmit - Callback appelé avec l'URL CodiMD
 * @param {boolean} [props.chargement=false] - État de chargement
 * @param {string} [props.erreur=null] - Message d'erreur éventuel
 * @param {Function} [props.onReset=null] - Callback pour réinitialiser l'erreur
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

// URLs d'exemple pour CodiMD
const EXAMPLE_URLS = [
    "https://codimd.apps.education.fr/s/w1D5hjCIC",
    "https://codimd.apps.education.fr/s/EVZXBuz6e",
];

function CodiMDTab({
    onUrlSubmit,
    chargement = false,
    erreur = null,
    onReset = null,
}) {
    const [urlCodimd, setUrlCodimd] = useState("");
    const [afficherAide, setAfficherAide] = useState(false);

    /**
     * Soumission du formulaire avec l'URL CodiMD
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        if (urlCodimd.trim()) {
            onUrlSubmit(urlCodimd.trim());
            setUrlCodimd(""); // Réinitialiser le champ après soumission
        }
    };

    /**
     * Gestion du clic sur un exemple d'URL
     * Remplit le champ et lance automatiquement le chargement
     */
    const handleExampleClick = (url) => {
        setUrlCodimd(url);
        onUrlSubmit(url);
    };

    /**
     * Toggle de l'affichage de l'aide
     */
    const toggleAide = () => {
        setAfficherAide(!afficherAide);
    };

    /**
     * Réinitialiser l'erreur pour permettre un nouvel essai
     */
    const handleReessayer = () => {
        if (onReset) {
            onReset();
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">
                Charger un document CodiMD
            </h3>

            <p className="text-gray-600 mb-4">
                Collez l'URL d'un document partagé depuis{" "}
                <strong>codimd.apps.education.fr</strong>.
                <button
                    onClick={toggleAide}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline text-sm focus:outline-none"
                    type="button"
                >
                    {afficherAide ? "Masquer" : "Voir"} des exemples
                </button>
            </p>

            {/* Aide avec exemples d'URLs cliquables */}
            {afficherAide && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                    <p className="font-semibold mb-3 text-blue-900">
                        💡 Exemples d'URL valides (cliquez pour tester) :
                    </p>
                    <ul className="space-y-2">
                        {EXAMPLE_URLS.map((url, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => handleExampleClick(url)}
                                    disabled={chargement}
                                    className="text-blue-600 hover:text-blue-800 underline hover:no-underline flex items-center gap-2 group transition disabled:opacity-50 disabled:cursor-not-allowed text-left"
                                    type="button"
                                >
                                    <code className="font-mono text-sm bg-white px-2 py-1 rounded border border-blue-200 group-hover:border-blue-400 transition">
                                        {url}
                                    </code>
                                    <span className="opacity-0 group-hover:opacity-100 text-xs bg-blue-600 text-white px-2 py-1 rounded transition-opacity whitespace-nowrap">
                                        Essayer ↗
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-gray-600">
                        CodiMD est le service de rédaction collaborative
                        Markdown officiel de l'Éducation nationale (RGPD,
                        hébergement France).
                    </p>
                </div>
            )}

            {/* Formulaire de chargement */}
            <form onSubmit={handleSubmit}>
                <input
                    type="url"
                    value={urlCodimd}
                    onChange={(e) => setUrlCodimd(e.target.value)}
                    placeholder="https://codimd.apps.education.fr/..."
                    className="w-full px-4 py-3 mb-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    disabled={chargement}
                    required
                    aria-label="URL du document CodiMD"
                />

                <button
                    type="submit"
                    disabled={chargement || !urlCodimd.trim()}
                    className={`w-full px-6 py-4 rounded-lg font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                        chargement
                            ? "bg-gray-400 text-gray-700 cursor-wait"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    aria-label="Charger le document CodiMD"
                >
                    {chargement ? "⏳ Chargement..." : "☁️ Charger le texte"}
                </button>
            </form>

            {/* Message d'erreur avec bouton Réessayer */}
            {erreur && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-sm font-semibold text-red-800">
                        ⚠️ Erreur
                    </p>
                    <p className="text-xs text-red-700 mt-1">{erreur}</p>

                    {/* Bouton Réessayer */}
                    {onReset && (
                        <button
                            onClick={handleReessayer}
                            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                        >
                            Réessayer
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

CodiMDTab.propTypes = {
    /** Callback appelé avec l'URL CodiMD à charger */
    onUrlSubmit: PropTypes.func.isRequired,

    /** État de chargement (désactive les contrôles) */
    chargement: PropTypes.bool,

    /** Message d'erreur à afficher (null si pas d'erreur) */
    erreur: PropTypes.string,

    /** Callback pour réinitialiser l'erreur */
    onReset: PropTypes.func,
};

export default CodiMDTab;
