import { createSelector } from 'reselect';
import * as R from 'ramda';
import { getEventsForCurrentRound } from './index';
import { getIsMyCrib } from './crib';
import { getCurrentHand } from './hand';
import { pointValue } from '../../points';

const sortByPointValue = R.sortBy(pointValue);
const first = R.take(1);
const getLowest = R.compose(first, sortByPointValue);

const getUserIdArg = (_, { userid }) => userid;

export const getPeggingEvents = createSelector(
  [getEventsForCurrentRound],
  events => events.filter(evt => evt.what === 'play pegging card'),
);

export const getPlayedCards = createSelector(
  [getPeggingEvents],
  events => events.map(evt => ({
    card: evt.cards[0],
    playedBy: evt.who,
    __typename: 'PegCard',
  })),
);

export const getPegTotal = createSelector(
  [getPlayedCards],
  playedCards =>
    // TODO: Need to separate rounds
    playedCards.map(pointValue).reduce((acc, curr) => acc + curr, 0),

);

const getLowestCard = createSelector(
  [getCurrentHand],
  hand => getLowest(hand),
);

const getRemainingTotal = createSelector(
  [getPegTotal],
  (total = 0) => 31 - total,
);

const hasLowEnoughCard = createSelector(
  [getLowestCard, getRemainingTotal],
  (lowCard, remainingTotal) => pointValue(lowCard) < remainingTotal,
);

export const canPlayCard = createSelector(
  [getPeggingEvents, getIsMyCrib, hasLowEnoughCard, getUserIdArg],
  (pegEvents, isMyCrib, hasCardToPlay, userid) => {
    const lastEvt = Array.from(pegEvents).pop() || {};
    if (!pegEvents.length) {
      return !isMyCrib;
    } else if (lastEvt.who !== userid) {
      return hasCardToPlay;
    }
    return false;
  },
);
