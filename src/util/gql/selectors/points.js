import { createSelector } from 'reselect';
import * as R from 'ramda';

import { PLAY_PEG_CARD, TAKE_A_GO, TAKE_DOUBLE_GO } from '../../types/events';
import { getPeggingEvents, getPlayedCards, getPegTotal } from './pegging';
import { sortByTimeSelector, lastEventSelector } from './index';
import { valueOf } from '../../deck';

const takeLastTwo = R.takeLast(2);
const cardVal = R.compose(valueOf, R.prop('card'));
const eqCard = R.eqBy(cardVal);
const areLastTwoEq = R.compose(R.apply(eqCard), takeLastTwo);

const getUserIdArg = (_, { userid }) => userid;

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
    if (played.length < 2) {
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


// TODO: currently retrurning sum of points for both players, needs to be just 1
export const getPeggingPoints = createSelector(
  [getPeggingEvents, getPegTotal, events => events, getUserIdArg],
  (pegEvents, total, allEvents, userid) => {
    const lastEvent = R.last(pegEvents) || {};
    if (lastEvent.what !== PLAY_PEG_CARD || lastEvent.who === userid) {
      return {
        fifteens: { points: 0, cards: [] },
        pairs: { points: 0, cards: [] },
        runs: { points: 0, cards: [] },
      };
    }
    return {
      fifteens: getPegFifteens(allEvents),
      pairs: getPegPairs(allEvents),
      runs: getPegRuns(allEvents),
    };
  },
);

// if the last event is a go, return the number of points for the go
// if the last event is a card play, return the number opf points scored
const getPegPointsTotal = createSelector(
  [getPeggingPoints, lastEventSelector],
  ({ fifteens, pairs, runs }, lastEvt) => {
    let sum = fifteens.points + pairs.points + runs.points;
    if (lastEvt.what === TAKE_A_GO) {
      sum += 1;
    } else if (lastEvt.what === TAKE_DOUBLE_GO) {
      sum += 2;
    }
    return sum;
  },
);

export const getPegs = createSelector(
  [sortByTimeSelector, getUserIdArg],
  (sortedEvents, userid) => {
    const events = Array.from(sortedEvents);
    const scoredPoints = [];
    let takeNum = 1;
    while (takeNum < events.length) {
      const nextPoints = getPegPointsTotal(R.take(takeNum, events), { userid });
      if (nextPoints > 0) {
        scoredPoints.push(nextPoints);
      }
      takeNum+=1;
    }
    return {
      front: R.sum(scoredPoints),
      rear: R.sum(R.dropLast(1, scoredPoints)),
    };
  },
);


export const getHandPoints = () => {};
