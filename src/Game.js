import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-firebase';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyles } from 'material-ui/styles';
import MuiDeckCutter from './MuiDeckCutter';
import BeginGameCuts from './BeginGameCuts';

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
    const { currentUser, gameId } = this.props;
    return (
      <Query
        pollInterval={10000}
        query={gql`
      {
        game(id: "${gameId}") {
          deck
          shownCuts
          hasCutForFirstCrib(userid: "${currentUser}")
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
                hasDoneCut={data.game.hasCutForFirstCrib}
              />
              <BeginGameCuts cuts={data.game.shownCuts} />
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
