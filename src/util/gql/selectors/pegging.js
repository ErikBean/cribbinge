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
    playedCards
      .map(({ card }) => pointValue(card))
      .reduce((acc, curr) => acc + curr, 0),
);

const getLowestCard = createSelector(
  [getCurrentHand],
  hand => getLowest(hand).pop(),
);

const getRemainingTotal = createSelector(
  [getPegTotal],
  (total = 0) => 31 - total,
);

const hasLowEnoughCard = createSelector(
  [getLowestCard, getRemainingTotal],
  (lowCard, remainingTotal) => {
    if (lowCard) {
      return pointValue(lowCard) < remainingTotal;
    }
    return false;
  },
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

const getLastPlayedCard = createSelector(
  [pegInfo => pegInfo.playedCards],
  playedCards => Array.from(playedCards).pop(),
);

const hasLowEnoughCardFromGameEvents = (_, { userid }, gameEvents) => hasLowEnoughCard(gameEvents, { userid }); // eslint-disable-line max-len

export const doesOpponentHaveAGo = createSelector(
  [getLastPlayedCard, getUserIdArg, hasLowEnoughCardFromGameEvents],
  (last, userid, hasCardToPlay) => {
    if (!last) {
      // no played cards: opponent does not havea go:
      return false;
    } else if (last.playedBy === userid) {
      // I played the last card, opponent does not have a go:
      return false;
    }
    // opponent has a go if I dont have a card I can play:
    return !hasCardToPlay;
  },
);
