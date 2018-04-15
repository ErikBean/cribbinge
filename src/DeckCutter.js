import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Card from './Card';

class DeckCutter extends PureComponent {
  static propTypes = {
    onDeckCut: PropTypes.func.isRequired,
    hasDoneCut: PropTypes.bool.isRequired,
    deck: PropTypes.arrayOf(PropTypes.string).isRequired,
  }
  state = {
    cutIndex: 0
  }
  sliceDeck = (e) => {
    this.setState({cutIndex: parseInt(e.target.value)});
  }
  render() {
    let begin = Math.max(this.state.cutIndex - 5, 0);
    let end = Math.min(this.state.cutIndex + 5, 51);
    
    return (
      <div style={{ height: '100%', position: 'relative' }}>
        <input onChange={this.sliceDeck} type="range" min="0" max="51"/>
        {
          this.props.deck.slice(begin, end).map((card, i) => {
            const cardStyle = {
              position: 'absolute',
              display: 'inline-block',
              height: '200px',
              width :'120px',
              backgroundColor: 'lightblue',
              border: '1px solid black',
              boxShadow: '0 1px 4px 1px rgba(0, 0, 0, 0.5)',
              transform: `translateY(-${i * 10}%) scale(${1 - (i/10)})`,

              zIndex: this.props.deck.length - i,
            }
            return (
              <div style={cardStyle} key={card}>
                {card}
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default DeckCutter;

