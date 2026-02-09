/**
 * Composant de choix de vitesse de lecture
 *
 * @component
 * @param {Object} props
 * @param {Function} props.choisirVitesse - Callback pour choisir la vitesse
 */

import React from "react";
import PropTypes from "prop-types";

function Choix({ choisirVitesse }) {
    const vitesses = [
        { valeur: 30, label: "Très lent", color: "blue" },
        { valeur: 50, label: "Lent", color: "green" },
        { valeur: 70, label: "Normal", color: "yellow" },
        { valeur: 90, label: "Rapide", color: "orange" },
        { valeur: 110, label: "Très rapide", color: "red" },
    ];

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Choisissez votre vitesse de lecture :
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {vitesses.map((v) => (
                    <button
                        key={v.valeur}
                        onClick={() => choisirVitesse(v.valeur)}
                        className={`px-4 py-3 rounded-lg font-medium transition transform hover:scale-105 ${
                            v.color === "blue"
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : v.color === "green"
                                  ? "bg-green-500 hover:bg-green-600 text-white"
                                  : v.color === "yellow"
                                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                    : v.color === "orange"
                                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                                      : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                        title={`${v.valeur} mots par minute`}
                    >
                        <div className="text-sm">{v.label}</div>
                        <div className="text-xs opacity-90">{v.valeur} MLM</div>
                    </button>
                ))}
            </div>
        </div>
    );
}

Choix.propTypes = {
    choisirVitesse: PropTypes.func.isRequired,
};

export default Choix;
