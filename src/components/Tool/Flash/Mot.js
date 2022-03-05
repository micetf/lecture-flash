import React from "react";

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
        if (this.props.speed === 0) return;
        const masqueMot = document.createElement("span");
        const masqueSpace = document.createElement("span");
        this.spanMotRef.current.append(masqueMot);
        this.spanSpaceRef.current.append(masqueSpace);
        masqueMot.classList.add("masque");
        masqueMot.style.animationDuration = `${this.props.speed *
            this.props.mot.length}ms`;
        masqueMot.onanimationend = () => {
            masqueSpace.classList.add("masque");
            masqueSpace.style.animationDuration = `${this.props.speed}ms`;
            masqueSpace.onanimationend = () => {
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

export default Mot;
