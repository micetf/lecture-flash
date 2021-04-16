import React from "react";

class Mot extends React.Component {
    shouldComponentUpdate({ masque }) {
        return this.props.masque !== masque;
    }

    render() {
        return (
            <span
                className={this.props.masque}
                onAnimationEnd={this.props.suivant}
            >
                <span>{this.props.mot}</span>
                <span> </span>
            </span>
        );
    }
}

export default Mot;
