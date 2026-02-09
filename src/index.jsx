/**
 * Point d'entrée principal de l'application Lecture Flash
 *
 * @module index
 * @requires react
 * @requires react-dom/client
 */

import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./components/App";

// Création du point de montage React 18
const root = createRoot(document.getElementById("app"));

// Rendu de l'application avec StrictMode
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
