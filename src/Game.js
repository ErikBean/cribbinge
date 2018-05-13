import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-firebase';
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import { needsFirstCutSelector, needsSecondCutSelector, shownCutsSelector, deckSelector, opponentSelector } from './util/projections';
import {messageSelector} from './util/projections/messages';
import MuiDeckCutter from './MuiDeckCutter';
import BeginGameCuts from './BeginGameCuts';
import InfoBar from './InfoBar';

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
    })
  }
  render(){
    const {currentUser, gameId } = this.props;
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
            <div>
              <MuiDeckCutter 
                deck={data.game.deck} 
                doCut={this.cutForFirstCrib}
                shownCuts={data.game.shownCuts}
                hasDoneCut={data.game.hasCutForFirstCrib}
              />
              <BeginGameCuts cuts={data.game.shownCuts}/>
            </div>
          );
        }}
      </Query>
    );
  }
}

Game.propTypes = {
  gameEvents: PropTypes.shape({}),
  addEvent: PropTypes.func.isRequired,
  currentUser: PropTypes.string.isRequired,
};
Game.defaultProps = {
  gameEvents: {},
};

const StyledGame = withStyles(styles)(Game);

export default connect((props, ref) => ({
  addEvent: evt => ref(`games/${props.gameId}`).push(evt),
  gameEvents: `games/${props.gameId}`,
}))(StyledGame);
