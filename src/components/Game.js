import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-firebase';

import Grid from '@material-ui/core/Grid';

import { createDeck, shuffle } from '../util/deck';
import { BeginGame, Discard, Pegging } from './stages';

class Game extends PureComponent {
  state = {
    selectedCards: [],
  }
  actions = () => ({
    cutForFirstCrib: this.cutForFirstCrib,
    deal: this.deal,
    discard: this.discard,
    takeAGo: this.takeAGo,
  })

  cutForFirstCrib = (card) => {
    this.props.addEvent({
      cards: [card],
      what: 'cut for first crib',
    });
  }
  deal = () => {
    const deck = shuffle(createDeck());
    this.props.addEvent({
      cards: {
        [this.props.opponent]: deck.slice(0, 6),
        [this.props.currentUser]: deck.slice(6, 12),
        __typename: 'Hands',
      },
      what: 'deal round 1',
    });
  }
  discard = () => {
    const cards = this.state.selectedCards;
    if (!cards || cards.length < 2) {
      window.alert('Please select two cards');
      return;
    }
    this.props.addEvent({
      cards,
      what: 'discard',
    });
  }
  playPegCard = (card) => {
    if (!this.state.selectedCards.includes(card)) { // select before playing
      this.setState({ selectedCards: [card] });
    } else {
      this.props.addEvent({
        cards: [card],
        what: 'play pegging card',
      });
    }
  }
  takeAGo = () => {
    this.props.addEvent({
      cards: '0',
      what: 'take a go',
    });
  }
  renderGameStage(stage) {
    switch (stage) {
      case 0:
        return (
          <BeginGame
            deck={this.props.deck}
            cutForFirstCrib={this.cutForFirstCrib}
            cutsForFirstCrib={this.props.cutsForFirstCrib}
          />
        );
      case 1:
        return (
          <Discard
            onCardClick={cards => this.setState({ selectedCards: cards })}
            hand={this.props.hand}
          />
        );
      case 2:
        return (
          <Pegging
            playPegCard={this.playPegCard}
            hand={this.props.hand}
            userid={this.props.currentUser}
          />
        );
      case 3: 
        return 'count your hand!'
      default:
        return `Not sure what stage this game is at (stage=${stage})`;
    }
  }
  render() {
    return (
      <Grid container>
        {this.renderGameStage(this.props.stage)}
        <Grid item xs={12}>
          {this.props.controls(this.actions())}
        </Grid>
      </Grid>
    );
  }
}

Game.propTypes = {
  addEvent: PropTypes.func.isRequired,
  controls: PropTypes.func.isRequired,
  currentUser: PropTypes.string.isRequired,
  cutsForFirstCrib: PropTypes.shape({
    shownCuts: PropTypes.arrayOf(PropTypes.string).isRequired,
    hasCutForFirstCrib: PropTypes.bool.isRequired,
  }).isRequired,
  deck: PropTypes.arrayOf(PropTypes.string).isRequired,
  gameId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  hand: PropTypes.shape({
    cards: PropTypes.arrayOf(PropTypes.string).isRequired,
    hasDiscarded: PropTypes.bool.isRequired,
  }).isRequired,
  opponent: PropTypes.string.isRequired,
  stage: PropTypes.number.isRequired,
};

export default connect((props, ref) => ({
  addEvent: evt => ref(`games/${props.gameId}`).push({
    timestamp: Date.now(),
    who: props.currentUser,
    __typename: 'Event',
    ...evt,
  }),
}))(Game);
