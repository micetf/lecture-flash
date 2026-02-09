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
