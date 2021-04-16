import React from "react";

const mclm = {
    50: "m50",
    60: "m60",
    70: "m70",
    80: "m80",
    90: "m90",
    100: "m100",
    110: "m110",
    120: "m120",
    130: "m130",
    140: "m140",
    150: "m150",
};
function Input({ texte, onTexteChange, onSwitchFlash }) {
    function handleChange(e) {
        e.preventDefault();
        onTexteChange(e.target.value);
    }
    const switchFlash = (e, n) => {
        e.preventDefault();
        onSwitchFlash(n);
    };
    return (
        <div className="form-group text-center">
            <div className="alert alert-primary text-justify">
                <p className="h4">
                    Copiez/collez votre texte dans le cadre ci-dessous puis
                    choisissez votre vitesse de lecture (en mots lus par
                    minute).
                </p>
                <p className="h4">
                    Vous passerez alors en mode lecture flash : une fois la
                    lecture commencée, le texte s'effacera progressivement à la
                    vitesse choisie.
                </p>
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
            <div className="btn-group my-2">
                {Object.keys(mclm).map(n => (
                    <button
                        className="btn btn-primary mx-1"
                        key={mclm[n]}
                        onClick={e => switchFlash(e, n)}
                        title={`Vitesse de lecture : ${n} mots lus par minute.`}
                    >
                        {n}
                        {` mlm`}
                    </button>
                ))}
            </div>
            <textarea
                className="form-control border border-primary"
                rows="25"
                onChange={handleChange}
                value={texte}
                placeholder="Écrivez ou collez le texte ici."
            ></textarea>
        </div>
    );
}

export default Input;
