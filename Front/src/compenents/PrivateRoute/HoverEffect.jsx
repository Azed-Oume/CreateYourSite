import React from 'react';

class HoverEffect extends React.Component {
    handleMouseEnter = () => {
        this.setState({ hovered: true });
    }

    handleMouseLeave = () => {
        this.setState({ hovered: false });
    }

    constructor(props) {
        super(props);
        this.state = {
            hovered: false
        };
    }

    render() {
        const { hovered } = this.state;
        return (
            <div className={hovered ? 'hovered' : 'hover-effect'} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                Contenu de l'élément
            </div>
        );
    }
}

export default HoverEffect;
