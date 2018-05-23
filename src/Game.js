import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-firebase';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyles } from 'material-ui/styles';
import MuiDeckCutter from './MuiDeckCutter';
import BeginGameCuts from './BeginGameCuts';
import SnackBar from './SnackBar';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    margin: theme.spacing.unit * 3,
  }),
});

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
            <React.Fragment>
              <MuiDeckCutter
                deck={data.game.deck}
                doCut={this.cutForFirstCrib}
                shownCuts={data.game.shownCuts}
                hasDoneCut={data.game.cutsForFirstCrib.hasCutForFirstCrib}
              />
              <BeginGameCuts cuts={data.game.cutsForFirstCrib.shownCuts} />
              <SnackBar message={data.game.message}/>
            </React.Fragment>
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

const StyledGame = withStyles(styles)(Game);

export default connect((props, ref) => ({
  addEvent: evt => ref(`games/${props.gameId}`).push(evt),
}))(StyledGame);
