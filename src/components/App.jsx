/**
 * Composant racine de l'application Lecture Flash
 *
 * @component
 * @returns {JSX.Element} Application principale
 */

import React from "react";
import PropTypes from "prop-types";
import LectureFlash from "./LectureFlash";
import Navbar from "./Navbar";
import Contact from "./Navbar/Contact";
import Paypal from "./Navbar/Paypal";
import HelpButton from "./HelpButton.jsx";

/**
 * Composant App
 * Gère la structure globale de l'application
 */
function App() {
    const path = "https://micetf.fr";
    const tool = "Lecture Flash";

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                path={path}
                tool={tool}
                right={[
                    <button
                        key="help"
                        onClick={() =>
                            window.open(
                                "https://micetf.fr/lecture-flash",
                                "_blank"
                            )
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                    >
                        Lecture Flash - V0
                    </button>,
                    <Paypal key="paypal" />,
                    <Contact key="contact" tool={tool} />,
                ]}
            />
            <main className="container mx-auto px-4 py-6 pt-16">
                <LectureFlash />
            </main>
        </div>
    );
}

export default App;
