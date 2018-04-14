import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

export default class DeckCutter extends PureComponent {
  static propTypes = {
    onDeckCut: PropTypes.func.isRequired,
    hasDoneCut: PropTypes.bool.isRequired,
    deck: PropTypes.arrayOf(PropTypes.string).isRequired,
  }
  render() {
    return (
      <div style={{ height: '100%' }}>
        {this.props.deck.map((card, i) => {
          const cardStyle = {
            position: 'absolute',
            marginRight: '5px',
            backgroundColor: 'lightblue',
            left: `${(i * 20) + 20}px`,
          };
          const onClick = this.props.hasDoneCut ? () => {} : () => this.props.onDeckCut(card);
          return (
            <div style={cardStyle} key={card}>
              <Card
                card={card}
                onClick={onClick}
                faceDown
              />
            </div>
          );
        })}
      </div>
    );
  }
}
