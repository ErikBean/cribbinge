import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-firebase';

import Grid from '@material-ui/core/Grid';

import { createDeck, shuffle } from './util/deck';

import MuiDeckCutter from './MuiDeckCutter';
import BeginGameCuts from './BeginGameCuts';

class Game extends PureComponent {
  cutForFirstCrib = (card) => {
    this.props.addEvent({
      card,
      timestamp: Date.now(),
      what: 'cut for first crib',
      who: this.props.currentUser,
    });
  }
  deal = () => {
    const deck = shuffle(createDeck());
    this.props.addEvent({
      cards: {
        [this.props.opponent]: deck.slice(0, 6),
        [this.props.currentUser]: deck.slice(6, 12),
      },
      timestamp: Date.now(),
      what: 'deal round 1',
      who: this.props.currentUser,
    });
  }
  renderBeginGameStage() {
    return (
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
    );
  }
  render() {
    return (
      <Grid container>
        {this.props.stage === 0 && this.renderBeginGameStage()}
      </Grid>
    );
  }
}

Game.propTypes = {
  gameId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  addEvent: PropTypes.func.isRequired,
  currentUser: PropTypes.string.isRequired,
  cutsForFirstCrib: PropTypes.shape({
    shownCuts: PropTypes.arrayOf(PropTypes.string).isRequired,
    hasCutForFirstCrib: PropTypes.bool.isRequired,
  }).isRequired,
  opponent: PropTypes.string.isRequired,
  deck: PropTypes.arrayOf(PropTypes.string).isRequired,
  stage: PropTypes.number.isRequired,
};

export default connect((props, ref) => ({
  addEvent: evt => ref(`games/${props.gameId}`).push(evt),
}))(Game);
