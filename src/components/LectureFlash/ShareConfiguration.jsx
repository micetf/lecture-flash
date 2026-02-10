/**
 * Composant de configuration du partage de texte
 *
 * VERSION 3.3.0 : Simplification - pas de re-sélection de vitesse
 *
 * @component
 * @param {Object} props
 * @param {string} props.sourceUrl - URL du texte CodiMD
 * @param {number} props.vitesse - Vitesse sélectionnée par l'enseignant (étape précédente)
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

const getVitesseLevelLabel = (speed) => {
    const labels = {
        30: "CP - début CE1",
        50: "CE1",
        70: "CE2",
        90: "CM1-CM2",
        110: "CM2 et +",
    };
    return labels[speed] || "Personnalisé";
};

function ShareConfiguration({ sourceUrl, vitesse }) {
    const [shareLocked, setShareLocked] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleGenerateLink = async () => {
        const params = new URLSearchParams({
            url: sourceUrl,
            speed: vitesse, // ← Utilise la vitesse déjà choisie
            locked: shareLocked ? "true" : "false",
        });

        const baseUrl = `${window.location.origin}/index.html`;
        const shareUrl = `${baseUrl}?${params.toString()}`;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        } catch (err) {
            console.error("Erreur lors de la copie du lien :", err);
            alert("Erreur lors de la copie du lien. Veuillez réessayer.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Rappel de la vitesse choisie */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    ⚡ Vitesse de lecture choisie
                </h3>
                <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-4xl font-bold text-blue-900 mb-1">
                        {vitesse} MLM
                    </p>
                    <p className="text-sm text-gray-600">
                        {getVitesseLevelLabel(vitesse)}
                    </p>
                </div>
            </div>

            {/* Configuration du partage */}
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                    🔗 Générer un lien de partage
                </h3>

                <p className="text-sm text-gray-700 mb-4">
                    Le lien permettra à vos élèves d'ouvrir ce document CodiMD
                    avec la vitesse <strong>{vitesse} MLM</strong>.
                </p>

                {/* Choix locked/unlocked */}
                <div className="space-y-3 mb-4">
                    <label className="flex items-start gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-green-400 cursor-pointer transition">
                        <input
                            type="radio"
                            name="lockMode"
                            checked={!shareLocked}
                            onChange={() => setShareLocked(false)}
                            className="mt-1"
                        />
                        <div>
                            <p className="font-semibold text-gray-800">
                                💡 Vitesse suggérée (recommandé)
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                Les élèves verront la vitesse recommandée mais
                                pourront la modifier si besoin (autonomie
                                guidée).
                            </p>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-orange-400 cursor-pointer transition">
                        <input
                            type="radio"
                            name="lockMode"
                            checked={shareLocked}
                            onChange={() => setShareLocked(true)}
                            className="mt-1"
                        />
                        <div>
                            <p className="font-semibold text-gray-800">
                                🔒 Vitesse imposée
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                Les élèves ne pourront pas modifier la vitesse.
                                La lecture démarrera automatiquement
                                (évaluation, exercice chronométré).
                            </p>
                        </div>
                    </label>
                </div>

                {/* Bouton de génération */}
                <button
                    onClick={handleGenerateLink}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg"
                >
                    📋 Copier le lien de partage
                </button>

                {/* Message de succès */}
                {showSuccess && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-lg text-green-800 text-sm animate-fade-in">
                        ✅ Lien copié ! Vous pouvez maintenant le coller dans
                        votre ENT, Digipad, ou l'envoyer par email.
                    </div>
                )}
            </div>

            {/* Récapitulatif du lien */}
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-xs text-gray-600">
                <p className="font-semibold mb-2">
                    📌 Récapitulatif du lien qui sera généré :
                </p>
                <ul className="list-disc list-inside space-y-1">
                    <li>
                        Document :{" "}
                        <code className="bg-white px-1 py-0.5 rounded">
                            {sourceUrl}
                        </code>
                    </li>
                    <li>
                        Vitesse :{" "}
                        <strong>
                            {vitesse} MLM ({getVitesseLevelLabel(vitesse)})
                        </strong>
                    </li>
                    <li>
                        Mode :{" "}
                        {shareLocked
                            ? "🔒 Imposée (auto-démarrage)"
                            : "💡 Suggérée (modifiable)"}
                    </li>
                </ul>
            </div>
        </div>
    );
}

ShareConfiguration.propTypes = {
    sourceUrl: PropTypes.string.isRequired,
    vitesse: PropTypes.number.isRequired,
};

export default ShareConfiguration;
