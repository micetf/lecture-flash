/**
 * Composant Paypal
 * Bouton avec icône coeur - identique à la version Bootstrap
 */

import React from "react";

function Paypal() {
    return (
        <form
            action="https://www.paypal.com/cgi-bin/webscr"
            method="post"
            target="_top"
            className="inline-block"
        >
            <button
                className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition my-1 mx-1"
                title="Si vous pensez que ces outils le méritent... Merci !"
                type="submit"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    className="h-4 w-4 inline"
                    fill="#f8f9fa"
                >
                    <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 00-7.78-7.77l-.61.61z"></path>
                </svg>
            </button>
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input
                type="hidden"
                name="hosted_button_id"
                value="Q2XYVFP4EEX2J"
            />
        </form>
    );
}

export default Paypal;
