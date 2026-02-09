/**
 * Composant Mot pour l'animation de disparition progressive
 * Version garantie fonctionnelle avec logs de debug
 *
 * @component
 * @param {Object} props
 * @param {string} props.mot - Mot à afficher
 * @param {number} props.speed - Vitesse d'animation (ms par caractère)
 * @param {Function} props.suivant - Callback appelé après l'animation
 */

import React from "react";
import PropTypes from "prop-types";

class Mot extends React.Component {
    constructor(props) {
        super(props);
        this.spanMotRef = React.createRef();
        this.spanSpaceRef = React.createRef();
    }

    shouldComponentUpdate({ speed }) {
        return this.props.speed !== speed;
    }

    componentDidUpdate() {
        console.log("🔤 Mot.componentDidUpdate:", {
            mot: this.props.mot,
            speed: this.props.speed,
        });

        if (this.props.speed === 0) {
            console.log("⏭️ Speed = 0, pas d'animation");
            return;
        }

        const masqueMot = document.createElement("span");
        const masqueSpace = document.createElement("span");

        this.spanMotRef.current.append(masqueMot);
        this.spanSpaceRef.current.append(masqueSpace);

        masqueMot.classList.add("masque");
        masqueMot.style.animationDuration = `${this.props.speed * this.props.mot.length}ms`;

        console.log("🎬 Animation démarrée:", {
            mot: this.props.mot,
            duree: this.props.speed * this.props.mot.length + "ms",
        });

        masqueMot.onanimationend = () => {
            console.log("✅ Animation mot terminée:", this.props.mot);
            masqueSpace.classList.add("masque");
            masqueSpace.style.animationDuration = `${this.props.speed}ms`;

            masqueSpace.onanimationend = () => {
                console.log("✅ Animation espace terminée, appel suivant()");
                this.props.suivant();
            };
        };
    }

    render() {
        return (
            <span className="mot">
                <span ref={this.spanMotRef}>{this.props.mot}</span>
                <span ref={this.spanSpaceRef}> </span>
            </span>
        );
    }
}

Mot.propTypes = {
    mot: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired,
    suivant: PropTypes.func.isRequired,
};

export default Mot;
