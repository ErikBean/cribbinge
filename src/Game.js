import React from 'react';
import { connect } from 'react-firebase';
import PropTypes from 'prop-types';
import { needsFirstCutSelector, needsSecondCutSelector, shownCutsSelector, deckSelector, opponentSelector } from './util/projections';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import MuiDeckCutter from './MuiDeckCutter';
import InfoBar from './InfoBar';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    margin: theme.spacing.unit * 3,
  }),
});

function Game({
  gameEvents, addEvent, currentUser, gameId, classes,
}) {
  const needsFirstCut = needsFirstCutSelector(gameEvents);
  const needsSecondCut = needsSecondCutSelector(gameEvents);
  const shownCuts = shownCutsSelector(gameEvents);
  const deck = deckSelector(gameEvents);
  const opponent = opponentSelector(gameId, currentUser);

  const showCutter = needsFirstCut || needsSecondCut || true;
  const cutEventName = needsFirstCut ? 'first cut' : 'second cut';
  const hasDoneCut = shownCuts.some(({ who }) => who === currentUser);
  return (
    <Paper className={classes.root} elevation={4}>
      {/* <InfoBar message="Cut to see who gets the first crib" open/> */}
      {showCutter &&
        <MuiDeckCutter
          hasDoneCut={hasDoneCut}
          shownCuts={shownCuts}
          onDeckCut={card => addEvent({ what: cutEventName, card })}
          opponent={opponent}
          deck={deck}
        />
      }
      {JSON.stringify(gameEvents, undefined, 2)}
    </Paper>
  );
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
  gameEvents: `games/${props.gameId}`,
}))(StyledGame);
