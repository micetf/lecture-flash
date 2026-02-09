/**
 * Composant Contact
 * Bouton avec icône email - identique à la version Bootstrap
 */

import React from "react";
import PropTypes from "prop-types";

function Contact({ tool }) {
    const handleClick = () => {
        window.location.href = `mailto:webmaster@micetf.fr?subject=${encodeURIComponent(tool)}`;
    };

    return (
        <button
            className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition my-1 mx-1"
            title="Pour contacter le webmaster..."
            onClick={handleClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className="h-4 w-4 inline"
                fill="#f8f9fa"
            >
                <path d="M18 2a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V4c0-1.1.9-2 2-2h16zm-4.37 9.1L20 16v-2l-5.12-3.9L20 6V4l-10 8L0 4v2l5.12 4.1L0 14v2l6.37-4.9L10 14l3.63-2.9z"></path>
            </svg>
        </button>
    );
}

Contact.propTypes = {
    tool: PropTypes.string.isRequired,
};

export default Contact;
