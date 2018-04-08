import React from 'react'
import { connect } from 'react-firebase'
import {needsFirstCut, needsSecondCut} from './util/projections';
import DeckCutter from './DeckCutter';

function Game ({gameEvents, addEvent, currentUser}) {
  if(needsFirstCut(gameEvents)){
    return <DeckCutter onDeckCut={(card) => addEvent(`${currentUser}:c1=${card}>`)}/>
  } else if(needsSecondCut(gameEvents)){
    return <DeckCutter onDeckCut={(card) => addEvent(`${currentUser}:c2=${card}>`)}/>
  }
  return (
    <div>{gameEvents}</div>
  );
}

export default connect((props, ref) => ({
  addEvent: evt => ref(`games/${props.gameId}`).set(props.gameEvents + evt),
}))(Game)
