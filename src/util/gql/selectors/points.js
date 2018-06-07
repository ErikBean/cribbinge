import { createSelector } from 'reselect';
import * as R from 'ramda';

import { PLAY_PEG_CARD } from '../../types/events';
import { getPeggingEvents, getPlayedCards, getPegTotal } from './pegging';
import { valueOf } from '../../deck';

const takeLastTwo = R.takeLast(2);
const cardVal = R.compose(valueOf, R.prop('card'));
const eqCard = R.eqBy(cardVal);
const areLastTwoEq = R.compose(R.apply(eqCard), takeLastTwo)

// console.log('>>> areLastTwoEq: ', areLastTwoEq([{card: 'H7'}, {card: 'S7'}]));
const getPegRuns = createSelector(
  [getPlayedCards],
  (played) => {
    return {
      points: 0,
      cards: []
    }
  }
)

const getPegPairs = createSelector(
  // TODO: This is taking in data that is NOT game.events but derived data from gql 
  [getPlayedCards],
  (played) => {
    const pairs = {
      cards: [],
      points: 0,
    }
    console.log('>>> played: ', played.length);
    // const isPair = areLastTwoEq(played); // n === n-1 ?
    // const isThreeOfAKind = isPair && areLastTwoEq(R.dropLast(1, played)); // n-1 === n-2 ? 
    // const isFourOfAKind = isPair && isThreeOfAKind && areLastTwoEq(R.dropLast(2, played)); // n-2 === n-3 ?
    // if(isPair) {
    //   pairs.points = 2;
    //   pairs.cards = R.takeLast(played, 2);
    // }
    // if(isThreeOfAKind){
    //   pairs.points = 6;
    //   pairs.cards = R.takeLast(played, 3);
    // }
    // if(isFourOfAKind){
    //   pairs.points = 12;
    //   pairs.cards = R.takeLast(played, 4);
    // }
    return pairs
  }
)

const getPegFifteens = createSelector(
  // TODO: This is taking in data that is NOT game.events but derived data from gql 
  [getPlayedCards, getPegTotal],
  (played, total) => {
    if(total === 15){
      return {
        cards: played.map(({card}) => card),
        points: 2,
      };
    }
    return {
      cards: [],
      points: 0,
    };
  }
)

export const getPeggingPoints = createSelector(
  [getPeggingEvents, getPegTotal, (events) => events],
  (pegEvents, total, allEvents) => {
    console.log('>>> PegEvents: ', pegEvents.length);
    const lastEvent = R.last(pegEvents) || {};
    if(lastEvent.what !== PLAY_PEG_CARD){
      return {
        fifteens: 0,
        pairs: 0,
        runs: 0,
      };
    } else {
      return {
        fifteens: getPegFifteens(allEvents),
        pairs: getPegPairs(allEvents),
        runs: getPegRuns(allEvents),
      }
    }
  },
);