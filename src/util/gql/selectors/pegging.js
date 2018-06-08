import { createSelector } from 'reselect';
import * as R from 'ramda';
import { getEventsForCurrentRound, lastEventSelector } from './index';
import { getIsMyCrib } from './crib';
import { getCurrentHand } from './hand';
import { pointValue } from '../../points';
import { TAKE_A_GO, PLAY_PEG_CARD } from '../../types/events';

const sortByPointValue = R.sortBy(pointValue);
const first = R.take(1);
const getLowest = R.compose(first, sortByPointValue);

const getUserIdArg = (_, { userid }) => userid;

export const getPeggingEvents = createSelector(
  [getEventsForCurrentRound],
  events => events.filter(evt => evt.what === PLAY_PEG_CARD || evt.what === TAKE_A_GO),
);

export const getPlayedCards = createSelector(
  [getPeggingEvents],
  (events) => {
    let eventsThisRound = Array.from(events);
    const lastGoIndexFromEnd = Array.from(events).reverse()
      .findIndex(evt => evt.what === TAKE_A_GO);
    if (lastGoIndexFromEnd >= 0) {
      const sliceAt = events.length - lastGoIndexFromEnd;
      eventsThisRound = events.slice(sliceAt);
    }
    return eventsThisRound.map(evt => ({
      card: evt.cards[0],
      playedBy: evt.who,
      __typename: 'PegCard',
    }));
  },
);

export const getPegTotal = createSelector(
  [getPlayedCards],
  playedCards =>
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
  [getPeggingEvents, getIsMyCrib, hasLowEnoughCard, getUserIdArg, () => {}],
  (pegEvents, isMyCrib, hasCardToPlay, userid) => {
    const lastEvt = Array.from(pegEvents).pop() || {};
    if (!pegEvents.length) {
      return !isMyCrib;
    } else if (lastEvt.who !== userid) {
      // TODO: also return hasCardToPlay if I have a go 
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
const getLastGameEvent = (_, __, gameEvents) => lastEventSelector(gameEvents);

export const doesOpponentHaveAGo = createSelector(
  [getLastPlayedCard, getUserIdArg, hasLowEnoughCardFromGameEvents, getLastGameEvent],
  (lastPlayedCard, userid, hasCardToPlay, lastEvent) => {
    if (lastEvent.what === TAKE_A_GO) {
      // someone needs to lead, cant take 2 gos in a row
      return false;
    }
    if (!lastPlayedCard) {
      // no played cards: opponent does not havea go:
      return false;
    } else if (lastPlayedCard.playedBy === userid) {
      // I played the last card, opponent does not have a go:
      return false;
    }
    // opponent has a go if I dont have a card I can play:
    return !hasCardToPlay;
  },
);
