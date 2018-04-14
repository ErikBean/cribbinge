import React, {PureComponent} from 'react'
import {createDeck, shuffle} from './util/deck'
import Card from './Card';

export default class DeckCutter extends PureComponent {
  state = {
    deck: [],
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
          }
          const onClick = this.props.hasDoneCut ? () => {} : () => this.props.onDeckCut(card)
          return (
            <div style={cardStyle} key={card}>
              <Card
                card={card}
                onClick={onClick}
                faceDown
              />
            </div>
          )
        })}
        {this.props.shownCuts.map(({card}) => (
          <Card card={card} key={card}/>
        ))}
      </div>
    );
  }
}
