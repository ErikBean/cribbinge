import React from 'react'
import { connect } from 'react-firebase'
import {needsFirstCutSelector, needsSecondCutSelector, shownCutsSelector} from './util/projections';
import DeckCutter from './DeckCutter';

function Game ({gameEvents, addEvent, currentUser}) {
  const needsFirstCut = needsFirstCutSelector(gameEvents);
  const needsSecondCut = needsSecondCutSelector(gameEvents);
  
  const showCutter = needsFirstCut || needsSecondCut || true;
  const cutEventName = needsFirstCut ? 'first cut' : 'second cut';
  const shownCuts = shownCutsSelector(gameEvents);
  const hasDoneCut = shownCuts.some(({who}) => who === currentUser);
  return (
    <div>
      {showCutter && 
        <DeckCutter
          hasDoneCut={hasDoneCut}
          onDeckCut={(card) => addEvent({what: cutEventName, card})}
          shownCuts={shownCuts}
        />
      }
      {JSON.stringify(gameEvents, undefined, 2)}
    </div>
  );
}

export default connect((props, ref) => ({
  addEvent: evt => ref(`games/${props.gameId}`).push({
    timestamp: Date.now(),
    who: props.currentUser,
    ...evt
  }),
  gameEvents:  `games/${props.gameId}`
}))(Game)
