import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-firebase';
import * as R from 'ramda';
import Grid from '@material-ui/core/Grid';

import { BeginGame, Discard, Pegging, FifthCard } from './stages';
import { createDeck, shuffle } from '../util/deck';
import {
  CUT_FOR_FIRST_CRIB,
  START_PEGGING,
  FLIP_FIFTH_CARD,
  DEAL,
  DISCARD,
  PLAY_PEG_CARD,
  TAKE_A_GO,
} from '../util/types/events';

class Game extends PureComponent {
  state = {
    selectedCards: [],
    remainingDeck: [],
  }
  static getDerivedStateFromProps(props) {
    const withoutMyHand = R.without(props.hand.cards);
    const withoutTheirHand = R.without(props.opponentHand.cards);
    const withoutCrib = R.without(props.crib.cards);
    const withoutDealtCards = R.compose(withoutMyHand, withoutTheirHand, withoutCrib);
    return {
      remainingDeck: withoutDealtCards(props.deck),
    };
  }
  actions = () => ({ // this is for the button on the message bar to do stuff
    countHand: this.countHand,
    cutForFirstCrib: this.cutForFirstCrib,
    continueToPegging: this.continueToPegging,
    deal: this.deal,
    discard: this.discard,
    takeAGo: this.takeAGo,
  })
  countHand = () => {
    console.log('>>> Want to count: ', this.props.hand);
  }
  cutForFirstCrib = (card) => {
    this.props.addEvent({
      cards: [card],
      what: CUT_FOR_FIRST_CRIB,
    });
  }
  flipFifthCard = (card) => {
    this.props.addEvent({
      cards: [card],
      what: FLIP_FIFTH_CARD,
    });
  }
  continueToPegging = () => {
    this.props.addEvent({
      cards: ['0'],
      what: START_PEGGING,
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
      what: DEAL,
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
      what: DISCARD,
    });
  }
  playPegCard = (card) => {
    if (!this.state.selectedCards.includes(card)) { // select before playing
      this.setState({ selectedCards: [card] });
    } else {
      // const { pegging: { fifteens, pairs, runs } } = this.props.points;
      // const total = fifteens.points + pairs.points + runs.points;
      // let points = { total };
      // if (total > 0) {
      //   points = {
      //     fifteens,
      //     pairs,
      //     runs,
      //     total,
      //   };
      // }
      this.props.addEvent({
        cards: [card],
        what: PLAY_PEG_CARD,
        // _meta: {points},
      });
    }
  }
  takeAGo = () => {
    this.props.addEvent({
      cards: '0',
      what: TAKE_A_GO,
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
          <FifthCard
            deck={this.state.remainingDeck}
            cut={this.props.cut}
            flipFifthCard={this.flipFifthCard}
            canFlip={this.props.crib.isMyCrib}
          />
        );
      case 3:
        return (
          <Pegging
            playPegCard={this.playPegCard}
            hand={this.props.hand}
            userid={this.props.currentUser}
            opponent={this.props.opponent}
          />
        );
      case 4:
        return 'count your hand!';
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
  crib: PropTypes.shape({
    isMyCrib: PropTypes.bool.isRequired,
  }).isRequired,
  currentUser: PropTypes.string.isRequired,
  cut: PropTypes.string.isRequired,
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
  opponentHand: PropTypes.shape({
    cards: PropTypes.arrayOf(PropTypes.string).isRequired,
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
