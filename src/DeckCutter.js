import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Card from './Card';
const style = {
  position: 'absolute',
  display: 'inline-block',
  height: '200px',
  width :'120px',
  backgroundColor: 'lightblue',
  border: '1px solid black',
  boxShadow: '0 1px 4px 1px rgba(0, 0, 0, 0.5)',
}

const divStyle = {width: '200px', height: '200px', display: 'inline-block'};

class DeckCutter extends PureComponent {
  static propTypes = {
    onDeckCut: PropTypes.func.isRequired,
    hasDoneCut: PropTypes.bool.isRequired,
    deck: PropTypes.arrayOf(PropTypes.string).isRequired,
  }
  state = {
    cutIndex: 25
  }
  sliceDeck = (e) => {
    this.setState({cutIndex: parseInt(e.target.value)});
  }
  render() {
    
    const {cutIndex} = this.state;
    return (
      <div style={{ height: '1000px'}}>
        <input onChange={this.sliceDeck} defaultValue={cutIndex} type="range" min="0" max="51" style={{width: '100%'}}/>
        <br />
        {
          this.props.deck.map((card, i) => {
            const leftStack = {
              top:'300px',
              left: `-${i * 2}px`,
              marginLeft: '150px',
            }
            const rightStack = {
              top: '300px',
              right: `-${i * 2}px`,
              marginRight: '150px',
            }
            let stack = {
              top: '300px',
              marginLeft:'35%',
              marginRight: 'auto',
            }
            if(i<cutIndex){
              stack = leftStack
            } else if(i> cutIndex){
              stack = rightStack;
            }
            const cardStyle = {
              position: 'absolute',
              // right: 0,
              display: 'inline-block',
              height: '200px',
              width :'120px',
              backgroundColor: 'lightblue',
              border: '1px solid black',
              boxShadow: '0 1px 4px 1px rgba(0, 0, 0, 0.5)',
              ...stack,
              // transform: `translateX(${i>cutIndex? '  ':'-'}${i * 5}%) scale(${1 - (i/51)})`,

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

