import { createSelector } from 'reselect';
import * as R from 'ramda';

import { PLAY_PEG_CARD } from '../../types/events';
import { getPeggingEvents, getPlayedCards, getPegTotal } from './pegging';
import { valueOf } from '../../deck';

const takeLastTwo = R.takeLast(2);
const cardVal = R.compose(valueOf, R.prop('card'));
const eqCard = R.eqBy(cardVal);
const areLastTwoEq = R.compose(R.apply(eqCard), takeLastTwo);

// console.log('>>> areLastTwoEq: ', areLastTwoEq([{card: 'H7'}, {card: 'S7'}]));
const getPegRuns = createSelector(
  [getPlayedCards],
  played => ({
    points: 0,
    cards: [],
  }),
);

const getPegPairs = createSelector(
  [getPlayedCards],
  (played) => {
    const pairs = {
      cards: [],
      points: 0,
    };
    if(played.length < 2){
      return pairs;
    }
    const isPair = areLastTwoEq(played); // n === n-1 ?
    const isThreeOfAKind = played.length > 2 && isPair && 
      areLastTwoEq(R.dropLast(1, played)); // n-1 === n-2 ?
    const isFourOfAKind = played.length > 3 && isPair && isThreeOfAKind &&
      areLastTwoEq(R.dropLast(2, played)); // n-2 === n-3 ?
    if (isPair) {
      pairs.points = 2;
      pairs.cards = R.takeLast(played, 2);
    }
    if (isThreeOfAKind) {
      pairs.points = 6;
      pairs.cards = R.takeLast(played, 3);
    }
    if (isFourOfAKind) {
      pairs.points = 12;
      pairs.cards = R.takeLast(played, 4);
    }
    return pairs;
  },
);

const getPegFifteens = createSelector(
  [getPlayedCards, getPegTotal],
  (played, total) => {
    if (total === 15) {
      return {
        cards: played.map(({ card }) => card),
        points: 2,
      };
    }
    return {
      cards: [],
      points: 0,
    };
  },
);

export const getPeggingPoints = createSelector(
  [getPeggingEvents, getPegTotal, events => events],
  (pegEvents, total, allEvents) => {
    const lastEvent = R.last(pegEvents) || {};
    if (lastEvent.what !== PLAY_PEG_CARD) {
      console.log('>>> Here: ', lastEvent);
      return {
        fifteens: 0,
        pairs: 0,
        runs: 0,
      };
    }
    return {
      fifteens: getPegFifteens(allEvents),
      pairs: getPegPairs(allEvents),
      runs: getPegRuns(allEvents),
    };
  },
);

export const getHandPoints = () => {};
