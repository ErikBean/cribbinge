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
import InfoBar from './InfoBar';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    margin: theme.spacing.unit * 3,
  }),
});

class Game extends PureComponent {
  render(){
    const {
      gameEvents, addEvent, currentUser, gameId, classes, changeIndex,
      remoteCutIndex
    } = this.props;
    const needsFirstCut = needsFirstCutSelector(gameEvents);
    const needsSecondCut = needsSecondCutSelector(gameEvents);
    const shownCuts = shownCutsSelector(gameEvents);
    const deck = deckSelector(gameEvents);
    const opponent = opponentSelector(gameId, currentUser);
    const messages = messageSelector(gameEvents, {currentUser}, opponent);
    
    const showCutter = needsFirstCut || needsSecondCut || true;
    const cutEventName = needsFirstCut ? 'first cut' : 'second cut';
    const hasDoneCut = shownCuts.some(({ who }) => who === currentUser);
    return (
      <Query
        query={gql`
      {
        game(id: "${gameId}") {
          events {
            what
          }
        }
      }
    `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :( {error.message}</p>;

          return JSON.stringify(data.game.events);
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
  addEvent: evt => ref(`games/${props.gameId}`).push({
    timestamp: Date.now(),
    who: props.currentUser,
    ...evt,
  }),
  changeIndex: index => ref('cutIndex').set(index),
  gameEvents: `games/${props.gameId}`,
  remoteCutIndex: 'cutIndex',
}))(StyledGame);
