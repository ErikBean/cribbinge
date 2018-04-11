import React from 'react'
import { connect } from 'react-firebase'
import {needsFirstCut, needsSecondCut, currentUserDidFirstCut, firstCut} from './util/projections';
import DeckCutter from './DeckCutter';

function Game ({gameEvents, addEvent, currentUser}) {
  if(needsFirstCut(gameEvents)){
    return (
      <DeckCutter 
        onDeckCut={(card) => addEvent({what: 'first cut', data: {card}})}
      />
    )
  } else if(needsSecondCut(gameEvents) && !currentUserDidFirstCut(gameEvents)){
    return (
      <DeckCutter 
        onDeckCut={(card) => addEvent({what: 'second cut', data: {card}})}
        revealed={[firstCut(gameEvents)]}
      />
    )
  }
  return (
    <div>{JSON.stringify(gameEvents, undefined, 2)}</div>
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
