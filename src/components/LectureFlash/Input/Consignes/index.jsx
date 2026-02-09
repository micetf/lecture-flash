/**
 * Composant affichant les consignes d'utilisation
 *
 * @component
 */

import React from "react";

function Consignes() {
    return (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded text-left">
            <ol className="text-lg space-y-3 list-decimal list-inside">
                <li>
                    <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition font-medium text-sm"
                        title="Cliquez sur le bouton Importer."
                    >
                        Importez
                    </button>{" "}
                    un fichier au format texte (.txt) ou copiez/collez votre
                    texte dans le cadre ci-dessous
                </li>
                <li>
                    Si vous avez copié/collé votre texte, vous pouvez l'
                    <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition font-medium text-sm mx-1"
                        title="Cliquez sur le bouton Enregistrer."
                    >
                        enregistrer
                    </button>
                    sur votre ordinateur dans un fichier au format texte (.txt).
                </li>
                <li>
                    Choisissez le type de lecture : lecture à voix haute ou
                    lecture silencieuse.
                </li>
                <li>
                    Choisissez votre vitesse de lecture : la vitesse s'affiche
                    en MLM (en mots lus par minute) au survol des boutons.
                </li>
            </ol>

            <div className="mt-4 bg-white border border-blue-200 rounded p-4">
                <p className="text-lg font-medium text-blue-900">
                    Vous passerez alors en mode lecture flash : une fois la
                    lecture commencée, le texte s'effacera progressivement à la
                    vitesse choisie.
                </p>
            </div>

            <p className="mt-4 text-sm italic text-gray-700">
                D'après un article de{" "}
                <a
                    href="https://twitter.com/ptitejulie89"
                    title="Julie Meunier"
                    className="text-blue-600 hover:underline"
                >
                    @petitejulie89
                </a>{" "}
                -{" "}
                <a
                    href="http://www.ecoledejulie.fr/fluence-le-texte-qui-s-efface-a207401800"
                    className="text-blue-600 hover:underline"
                >
                    Fluence : le texte qui s'efface
                </a>
                . (Version LibreOffice Impress ou MS PowerPoint de l'outil).
            </p>
        </div>
    );
}

export default Consignes;
