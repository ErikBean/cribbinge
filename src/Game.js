import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-firebase';

import Grid from '@material-ui/core/Grid';

import { createDeck, shuffle } from './util/deck';

import MuiDeckCutter from './MuiDeckCutter';
import BeginGameCuts from './BeginGameCuts';
import Hand from './Hand';

class Game extends PureComponent {
  state = {
    selectedCards: [],
  }
  actions = () => ({
    cutForFirstCrib: this.cutForFirstCrib,
    deal: this.deal,
    discard: this.discard,
  })

  cutForFirstCrib = (card) => {
    this.props.addEvent({
      card,
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
  discard = (cards = this.state.selectedCards) => {
    if (!cards || cards.length < 2) {
      window.alert('Please select two cards');
      return;
    }
    this.props.addEvent({
      cards,
      what: 'discard',
    });
  }
  playPegCard = ([card]) => {
    if (!this.state.selectedCards.includes(card)) { // select before playing
      this.setState({ selectedCards: [card] });
    } else {
      console.log('wanna peg: ', card);
    }
  }
  renderDiscardStage = () => (
    <React.Fragment>
      <Grid
        item
        xs={12}
        style={{
          paddingTop: '100px',
        }}
      >
        <Hand
          {...this.props.hand}
          onCardClick={cards => this.setState({ selectedCards: cards })}
          selectable={2}
        />
      </Grid>
    </React.Fragment>
  )
  renderPeggingStage = () => (
    <React.Fragment>
      <Grid
        item
        xs={12}
      >
        <Hand
          {...this.props.hand}
          onCardClick={this.playPegCard}
          selectable={1}
        />
      </Grid>
    </React.Fragment>
  )
  renderBeginGameStage = () => (
    <React.Fragment>
      <Grid item sm={12} lg={6}>
        <MuiDeckCutter
          deck={this.props.deck}
          doCut={this.cutForFirstCrib}
          shownCuts={this.props.cutsForFirstCrib.shownCuts}
          hasDoneCut={this.props.cutsForFirstCrib.hasCutForFirstCrib}
        />
      </Grid>
      <Grid item sm={12} lg={6}>
        <BeginGameCuts cuts={this.props.cutsForFirstCrib.shownCuts} />
      </Grid>
    </React.Fragment>
  )
  renderGameStage(stage) {
    switch (stage) {
      case 0:
        return this.renderBeginGameStage();
      case 1:
        return this.renderDiscardStage();
      case 2:
        return this.renderPeggingStage();
      default:
        return 'Not sure whats happening';
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
