import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-firebase';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Grid from '@material-ui/core/Grid';

import {getMessage, getActionText} from './util/messages';
import { createDeck, shuffle } from './util/deck';

import MuiDeckCutter from './MuiDeckCutter';
import BeginGameCuts from './BeginGameCuts';
import GameControls from './GameControls';
import SnackBar from './SnackBar';

class Game extends PureComponent {
  opponent = this.props.gameId.replace(this.props.currentUser, '').replace('-', '')
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
      cards:{
        [this.opponent]: deck.slice(0,6),
        [this.props.currentUser]: deck.slice(6,12),
      },
      timestamp: Date.now(),
      what: 'deal round 1',
      who: this.props.currentUser,
    });
  }
  renderBeginGameStage(data){
    return (
      <React.Fragment>
        <Grid item sm={12} lg={6}>
          <MuiDeckCutter
            deck={data.game.deck}
            doCut={this.cutForFirstCrib}
            shownCuts={data.game.shownCuts}
            hasDoneCut={data.game.cutsForFirstCrib.hasCutForFirstCrib}
          />
        </Grid>
        <Grid item sm={12} lg={6}>
          <BeginGameCuts cuts={data.game.cutsForFirstCrib.shownCuts} />
        </Grid>
      </React.Fragment>
    )
  }
  render() {
    const { currentUser, gameId } = this.props;
    // const opponent = ;
    return (
      <Query
        pollInterval={10000}
        query={gql`
      {
        game(id: "${gameId}") {
          deck
          stage
          cutsForFirstCrib {
            hasCutForFirstCrib(userid: "${currentUser}")
            shownCuts
            winner
          }
        }
      }
    `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :( {error.message}</p>;
          const message = getMessage(data.game, {currentUser, opponent: this.opponent})
          return (
            <Grid container>
              {data.game.stage === 0 && this.renderBeginGameStage(data)}
              {/* <SnackBar message={data.game.message} /> */}
              <Grid item sm={12}>
                <GameControls
                  message={message.text}
                  actionText={message.actionText}
                  action={this[message.action]}
                />
              </Grid>
            </Grid>
          );
        }}
      </Query>
    );
  }
}

Game.propTypes = {
  gameId: PropTypes.string.isRequired,
  addEvent: PropTypes.func.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default connect((props, ref) => ({
  addEvent: evt => ref(`games/${props.gameId}`).push(evt),
}))(Game);
