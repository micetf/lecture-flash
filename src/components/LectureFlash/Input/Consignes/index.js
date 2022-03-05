import React from "react";

function Consignes() {
    return (
        <div className="alert alert-primary text-justify">
            <ol className="h5">
                <li>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Cliquez sur le bouton Importer."
                    >
                        Importez
                    </button>{" "}
                    un fichier au format texte (.txt) ou copiez/collez votre
                    texte dans le cadre ci-dessous
                </li>
                <li>
                    Si vous avez copiez/collez votre texte, vous pouvez l'
                    <button
                        type="button"
                        className="btn btn-secondary"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Cliquez sur le bouton Enregistrer."
                    >
                        enregistrer
                    </button>{" "}
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
            <ul className="h4 list-group">
                <li className="list-group-item">
                    Vous passerez alors en mode lecture flash : une fois la
                    lecture commencée, le texte s'effacera progressivement à la
                    vitesse choisie.
                </li>
            </ul>
            <p className="font-italic">
                D'après un article de{" "}
                <a
                    href="https://twitter.com/ptitejulie89"
                    title="Julie Meunier"
                >
                    @petitejulie89
                </a>{" "}
                -{" "}
                <a href="http://www.ecoledejulie.fr/fluence-le-texte-qui-s-efface-a207401800">
                    Fluence : le texte qui s'efface
                </a>
                . (Version LibreOffice Impress ou MS PowerPoint de l'outil).
            </p>
        </div>
    );
}

export default Consignes;
