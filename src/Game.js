import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-firebase';

import Grid from '@material-ui/core/Grid';

import { createDeck, shuffle } from './util/deck';

import MuiDeckCutter from './MuiDeckCutter';
import BeginGameCuts from './BeginGameCuts';
import Hand from './Hand';

class Game extends PureComponent {
  actions = {
    cutForFirstCrib: this.cutForFirstCrib,
    deal: this.deal,
  }

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
      },
      what: 'deal round 1',
    });
  }
  renderDiscardStage = () => (
    <Grid item xs={12} style={{position: 'fixed', bottom: '150px'}}>
      <Hand cards={this.props.hand}/>
    </Grid>
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
  renderGameStage(stage){
    switch(stage){
      case 0:
        return this.renderBeginGameStage();
      case 1:
        return this.renderDiscardStage();
      default: 
        return 'Not sure whats happening'
    }
  }
  render() {
    return (
      <Grid container>
        {this.renderGameStage(this.props.stage)}
        <Grid item xs={12}>
          {this.props.controls(this.actions)}
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
  hand: PropTypes.arrayOf(PropTypes.string).isRequired,
  opponent: PropTypes.string.isRequired,
  stage: PropTypes.number.isRequired,
};

export default connect((props, ref) => ({
  addEvent: evt => ref(`games/${props.gameId}`).push({
    timestamp: Date.now(),
    who: props.currentUser,
    ...evt,
  }),
}))(Game);
