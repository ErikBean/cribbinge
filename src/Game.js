import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-firebase';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Grid from '@material-ui/core/Grid';

import MuiDeckCutter from './MuiDeckCutter';
import BeginGameCuts from './BeginGameCuts';
import SnackBar from './SnackBar';

class Game extends PureComponent {
  cutForFirstCrib = (card) => {
    this.props.addEvent({
      card,
      timestamp: Date.now(),
      what: 'cut for first crib',
      who: this.props.currentUser,
    });
  }
  render() {
    const { currentUser, gameId, opponent } = this.props;
    return (
      <Query
        pollInterval={10000}
        query={gql`
      {
        game(id: "${gameId}") {
          deck
          cutsForFirstCrib {
            hasCutForFirstCrib(userid: "${currentUser}")
            shownCuts
          }
          message(userid: "${currentUser}", opponentid: "${opponent}")
        }
      }
    `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :( {error.message}</p>;
          return (
            <Grid container>
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
              <SnackBar message={data.game.message}/>
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
