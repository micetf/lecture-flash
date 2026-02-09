/**
 * Composant Navbar avec Tailwind CSS
 * Version identique à la navbar Bootstrap d'origine
 *
 * @component
 * @param {Object} props
 * @param {string} props.path - Chemin du site principal (https://micetf.fr)
 * @param {string} props.tool - Nom de l'outil
 * @param {Array} props.right - Composants à afficher à droite (Contact, Paypal)
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

function Navbar({ path, tool, right = [] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 bg-gray-800 shadow-lg z-50">
            <div className="max-w-full px-4">
                <div className="flex items-center justify-between h-14">
                    {/* Logo MiCetF */}
                    <a
                        href={path}
                        className="text-white font-semibold text-lg hover:text-gray-300 transition"
                    >
                        MiCetF
                    </a>

                    {/* Bouton hamburger mobile */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden inline-flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition"
                        type="button"
                        aria-controls="navbarToggle"
                        aria-expanded={isOpen}
                        aria-label="Toggle navigation"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {/* Contenu du menu (desktop) */}
                    <div className="hidden md:flex md:items-center md:flex-1">
                        {/* Chevron + Nom de l'outil */}
                        <div className="flex items-center ml-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                className="h-4 w-4 mr-1"
                                fill="#f8f9fa"
                            >
                                <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"></path>
                            </svg>
                            <span className="text-white font-semibold text-lg">
                                {tool}
                            </span>
                        </div>

                        {/* Espacement pour pousser les boutons à droite */}
                        <div className="flex-1"></div>

                        {/* Boutons à droite (Paypal et Contact) */}
                        <ul className="flex items-center space-x-2">
                            {right.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Menu mobile (collapse) */}
                {isOpen && (
                    <div className="md:hidden pb-3" id="navbarToggle">
                        {/* Chevron + Nom de l'outil (mobile) */}
                        <div className="flex items-center py-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                className="h-4 w-4 mr-1"
                                fill="#f8f9fa"
                            >
                                <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"></path>
                            </svg>
                            <span className="text-white font-semibold text-lg">
                                {tool}
                            </span>
                        </div>

                        {/* Boutons (mobile) */}
                        <ul className="space-y-2 mt-2">
                            {right.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
}

Navbar.propTypes = {
    path: PropTypes.string.isRequired,
    tool: PropTypes.string.isRequired,
    right: PropTypes.array,
};

export default Navbar;
