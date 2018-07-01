import { createSelector } from 'reselect';
import * as R from 'ramda';

import { PLAY_PEG_CARD, TAKE_A_GO, COUNT_HAND } from '../../types/events';
import { valueOf } from '../../deck';
import { getCurrentHand } from './hand';
import { sortByTimeSelector, lastEventSelector, getCut, getEventsForCurrentRound } from './index';
import { getPeggingEvents, getPlayedCards, getPegTotal } from './pegging';
import { getFifteens as getFifteensCards } from '../../legacy_points';

const takeLastTwo = R.takeLast(2);
const cardVal = R.compose(valueOf, R.prop('card'));
const eqCard = R.eqBy(cardVal);
const areLastTwoEq = R.compose(R.apply(eqCard), takeLastTwo);
const getCardVals = R.map(cardVal);
const plusEqualsOne = (a, b) => (a + 1) === b;
const sortByVal = R.sort((a, b) => valueOf(a) > valueOf(b));

// take an array, sort it, determine if its in order
const isSequential = nums => R.sort((a, b) => a > b, nums).reduce((acc, curr, idx) => {
  if (idx === 0) return true;
  return acc && plusEqualsOne(nums[idx - 1], curr);
}, true);
/* eslint-disable */
const g = (xs, n) =>
  (n == 0 ? [[]] :
    R.isEmpty(xs) ? [] :
      R.concat(
        R.map(R.prepend(R.head(xs)), g(R.tail(xs), n - 1))
        , g(R.tail(xs), n),
      ));
/* eslint-enable */

const getUserIdArg = (_, { userid }) => userid;

const getPegRuns = createSelector(
  [getPlayedCards],
  (played) => {
    let run = {
      points: 0,
      cards: [],
    };
    if (played.length < 3) return run;
    let n = 3; // run length
    while (n <= played.length) {
      const lastN = R.takeLast(n, played);
      if (isSequential(getCardVals(lastN))) {
        run = {
          points: n,
          cards: lastN,
        };
      }
      n += 1;
    }
    return run;
  },
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
    if (lastEvent.what !== PLAY_PEG_CARD || lastEvent.who !== userid) {
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
  [getPeggingPoints, evts => getPegTotal(R.dropLast(1, evts)), lastEventSelector, getUserIdArg],
  ({ fifteens, pairs, runs }, total, lastEvt, userid) => {
    let sum = fifteens.points + pairs.points + runs.points;
    if (lastEvt.who !== userid) return sum;
    if (lastEvt.what === TAKE_A_GO) {
      sum += 1;
      if (total === 31) sum += 1;
    }
    return sum;
  },
);

const getPairs = (handWithCut) => {
  const sortedHand = sortByVal(handWithCut);
  const pairsCards = sortedHand.reduce((acc, curr, idx) => {
    if (sortedHand.indexOf(curr) < 3) {
      return acc;
    }
    if (valueOf(sortedHand[idx - 1]) === valueOf(curr)) {
      acc.push([sortedHand[idx - 1], curr]);
    }
    if (valueOf(sortedHand[idx - 2]) === valueOf(curr)) {
      acc.push([sortedHand[idx - 2], curr]);
    } // three of a kind
    if (valueOf(sortedHand[idx - 3]) === valueOf(curr)) {
      acc.push([sortedHand[idx - 3], curr]);
    } // four of a kind
    return acc;
  }, []);
  return {
    cards: pairsCards,
    points: pairsCards.length * 2,
  };
};

const getFifteens = (handWithCut) => {
  const fifteens = getFifteensCards(handWithCut);
  const numFifteens = Object.keys(fifteens)
    .map(num => fifteens[num])
    .reduce((acc, curr) => acc + curr.length, 0);
  const points = numFifteens * 2;

  return {
    cards: fifteens,
    points,
  };
};

const getRuns = (handWithCut) => {
  // create all 3,4, and 5 card permutations:
  const [perm3, perm4, perm5] = [3, 4, 5].map(n => g(handWithCut, n));
  // filter out non-sequential ones:
  const [runs3, runs4, runs5] = [perm3, perm4, perm5]
    .map(p => p.filter(a => isSequential(a.map(valueOf))));
  const allRuns = runs3.concat(runs4).concat(runs5);
  const points = allRuns.reduce((acc, curr) => acc + curr.length, 0);
  return {
    cards: allRuns,
    points,
  };
};

const getHasCounted = createSelector(
  [getEventsForCurrentRound, getUserIdArg],
  (events, userid) => {
    const coundHandFilter = evt => evt.what === COUNT_HAND && evt.who === userid;
    return Boolean(events.filter(coundHandFilter).length);
  },
);

export const getHandPoints = createSelector(
  [getCurrentHand, getCut, getHasCounted],
  (currentHand, cut, hasCounted) => {
    const handWithCut = currentHand.concat(cut);
    const fifteens = getFifteens(handWithCut);
    const pairs = getPairs(handWithCut);
    const runs = getRuns(handWithCut);
    return {
      fifteens,
      pairs,
      runs,
      total: runs.points + pairs.points + fifteens.points,
      hasCounted,
    };
  },
);

export const getPegs = createSelector(
  [sortByTimeSelector, getUserIdArg],
  (sortedEvents, userid) => {
    const events = Array.from(sortedEvents);
    const scoredPoints = [];
    let takeNum = 1;
    while (takeNum <= events.length) {
      const pegPoints = getPegPointsTotal(R.take(takeNum, events), { userid });
      if (pegPoints > 0) {
        scoredPoints.push(pegPoints);
      }
      const lastEvt = R.last(R.take(takeNum, events));
      if (lastEvt.what === COUNT_HAND && lastEvt.who === userid) {
        const handPoints = getHandPoints(R.take(takeNum, events), { userid }).total;
        scoredPoints.push(handPoints);
      }
      takeNum += 1;
    }
    return {
      front: R.sum(scoredPoints),
      rear: R.sum(R.dropLast(1, scoredPoints)),
    };
  },
);
