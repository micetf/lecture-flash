/**
 * Word component for progressive disappearing animation
 * VERSION 3.9.0 : Ajout support retours ligne et paragraphes
 *
 * @component
 * @param {Object} props
 * @param {string} props.word - Mot à afficher
 * @param {number} props.speed - Vitesse d'animation (ms par caractère)
 * @param {Function} props.onNext - Callback appelé après l'animation
 * @param {boolean} [props.finDeLigne=false] - Indique si c'est la fin d'une ligne
 * @param {boolean} [props.finDeParagraphe=false] - Indique si c'est la fin d'un paragraphe
 */

import React from "react";
import PropTypes from "prop-types";

class Word extends React.Component {
    constructor(props) {
        super(props);
        this.wordSpanRef = React.createRef();
        this.spaceSpanRef = React.createRef();
        this.wordMask = null;
        this.spaceMask = null;
    }

    componentDidMount() {
        this.startAnimation();
    }

    componentDidUpdate(prevProps) {
        // Restart only if speed changes from 0 → value
        if (prevProps.speed === 0 && this.props.speed > 0) {
            this.startAnimation();
        }
        // 🆕 Gérer pause/reprise
        if (prevProps.isPaused !== this.props.isPaused) {
            const playState = this.props.isPaused ? "paused" : "running";

            if (this.wordMask) {
                this.wordMask.style.animationPlayState = playState;
            }

            if (this.spaceMask) {
                this.spaceMask.style.animationPlayState = playState;
            }
        }
    }

    startAnimation() {
        const { speed, word, onNext } = this.props;

        if (speed === 0) {
            return;
        }

        // Clean previous masks if any
        if (this.wordSpanRef.current) {
            this.wordSpanRef.current
                .querySelectorAll(".masque")
                .forEach((node) => node.remove());
        }
        if (this.spaceSpanRef.current) {
            this.spaceSpanRef.current
                .querySelectorAll(".masque")
                .forEach((node) => node.remove());
        }

        const wordMask = document.createElement("span");
        const spaceMask = document.createElement("span");
        // 🆕 Sauvegarder les références
        this.wordMask = wordMask;
        this.spaceMask = spaceMask;

        this.wordSpanRef.current.append(wordMask);
        this.spaceSpanRef.current.append(spaceMask);

        wordMask.classList.add("masque");
        wordMask.style.animationDuration = `${speed * word.length}ms`;
        // 🆕 Appliquer l'état de pause si déjà en pause au démarrage
        wordMask.style.animationPlayState = this.props.isPaused
            ? "paused"
            : "running";

        wordMask.onanimationend = () => {
            spaceMask.classList.add("masque");
            spaceMask.style.animationDuration = `${speed}ms`;
            spaceMask.style.animationPlayState = this.props.isPaused
                ? "paused"
                : "running";

            spaceMask.onanimationend = () => {
                onNext();
            };
        };
    }

    render() {
        const { word, finDeLigne, finDeParagraphe } = this.props;

        return (
            <>
                <span className="mot">
                    <span ref={this.wordSpanRef}>{word}</span>
                    <span ref={this.spaceSpanRef}> </span>
                </span>
                {/* Retour ligne simple si fin de ligne */}
                {finDeLigne && !finDeParagraphe && <br />}
                {/* Double retour ligne si fin de paragraphe */}
                {finDeParagraphe && (
                    <>
                        <br />
                        <br />
                    </>
                )}
            </>
        );
    }
}

Word.propTypes = {
    word: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired,
    onNext: PropTypes.func.isRequired,
    finDeLigne: PropTypes.bool,
    finDeParagraphe: PropTypes.bool,
    isPaused: PropTypes.bool, // 🆕 Ajout
};

Word.defaultProps = {
    finDeLigne: false,
    finDeParagraphe: false,
    isPaused: false, // 🆕 Ajout
};

export default Word;
