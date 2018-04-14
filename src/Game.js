import React from 'react';
import { connect } from 'react-firebase';
import PropTypes from 'prop-types';
import { needsFirstCutSelector, needsSecondCutSelector, shownCutsSelector, deckSelector } from './util/projections';
import DeckCutter from './DeckCutter';


function Game({ gameEvents, addEvent, currentUser }) {
  const needsFirstCut = needsFirstCutSelector(gameEvents);
  const needsSecondCut = needsSecondCutSelector(gameEvents);
  const shownCuts = shownCutsSelector(gameEvents);
  const deck = deckSelector(gameEvents);

  const showCutter = needsFirstCut || needsSecondCut || true;
  const cutEventName = needsFirstCut ? 'first cut' : 'second cut';
  const hasDoneCut = shownCuts.some(({ who }) => who === currentUser);
  return (
    <div>
      {showCutter &&
        <DeckCutter
          hasDoneCut={hasDoneCut}
          onDeckCut={card => addEvent({ what: cutEventName, card })}
          deck={deck}
        />
      }
      {JSON.stringify(gameEvents, undefined, 2)}
    </div>
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

export default connect((props, ref) => ({
  addEvent: evt => ref(`games/${props.gameId}`).push({
    timestamp: Date.now(),
    who: props.currentUser,
    ...evt,
  }),
  gameEvents: `games/${props.gameId}`,
}))(Game);
