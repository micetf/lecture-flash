/**
 * Word component for progressive disappearing animation
 * Fixed version with componentDidMount
 *
 * @component
 * @param {Object} props
 * @param {string} props.word - Word to display
 * @param {number} props.speed - Animation speed (ms per character)
 * @param {Function} props.onNext - Callback called after the animation
 */

import React from "react";
import PropTypes from "prop-types";

class Word extends React.Component {
    constructor(props) {
        super(props);
        this.wordSpanRef = React.createRef();
        this.spaceSpanRef = React.createRef();
    }

    componentDidMount() {
        this.startAnimation();
    }

    componentDidUpdate(prevProps) {
        // Restart only if speed changes from 0 → value
        if (prevProps.speed === 0 && this.props.speed > 0) {
            this.startAnimation();
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

        this.wordSpanRef.current.append(wordMask);
        this.spaceSpanRef.current.append(spaceMask);

        wordMask.classList.add("masque");
        wordMask.style.animationDuration = `${speed * word.length}ms`;

        wordMask.onanimationend = () => {
            spaceMask.classList.add("masque");
            spaceMask.style.animationDuration = `${speed}ms`;

            spaceMask.onanimationend = () => {
                onNext();
            };
        };
    }

    render() {
        const { word } = this.props;

        return (
            <span className="mot">
                <span ref={this.wordSpanRef}>{word}</span>
                <span ref={this.spaceSpanRef}> </span>
            </span>
        );
    }
}

Word.propTypes = {
    word: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired,
    onNext: PropTypes.func.isRequired,
};

export default Word;
