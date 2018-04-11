import React, {Component} from 'react'
import {createDeck, shuffle} from './util/deck'
import Card from './Card';

export default class DeckCutter extends Component {
  state = {
    deck: [],
    hovered: ''
  }
  componentDidMount(){
    this.setState({
      deck: shuffle(createDeck())
    })
  }
  render(){
    return (
      <div style={{height: '100%'}}>
        {this.state.deck.map((card, i) => {
          const cardStyle = {
            position: 'absolute',
            marginRight: '5px',
            backgroundColor: 'lightblue',
            left: `${i * 20 + 20}px`,
            transform: card === this.state.hovered ? 'translateY(-100%)' : '',
          }
          return (
            <div style={cardStyle} key={card}>
              <div
                style={{position: 'absolute', width :'20px', height: '200px'}}
                onMouseEnter={() => this.setState({hovered: card})}
                onClick={() => this.props.onDeckCut(card)} 
              />
              <Card
                card={card} onClick={() => this.props.onDeckCut(card)}
                faceDown
              />
              {this.state.hovered === card && (
                <Card card={card} />
              )}
            </div>
          )
        })}
      </div>
    );
  }
}
