import * as R from 'ramda';

const { createSelector } = require('reselect');
const {
  CUT_FOR_FIRST_CRIB,
  START,
  DEAL,
  DISCARD,
  FLIP_FIFTH_CARD,
  START_PEGGING,
  PLAY_PEG_CARD,
  TAKE_A_GO,
} = require('../../types/events');

export function sortByTimeSelector(gameEvents) {
  if (!gameEvents) return [];
  // its already sorted
  return gameEvents;
}

export const getDeck = createSelector(
  [sortByTimeSelector],
  (sortedEvents) => {
    const deckEvent = Array.from(sortedEvents).reverse().find(({ what }) => what === START);
    if (deckEvent) {
      return deckEvent.cards;
    }
    return [];
  },
);

export const lastEventSelector = createSelector(
  [sortByTimeSelector],
  (sortedEvents) => {
    if (sortedEvents.length) return R.last(sortedEvents);
    return {};
  },
);


export const getEventsForCurrentRound = createSelector(
  [sortByTimeSelector],
  (sortedEvents) => {
    const dealEvent = Array.from(sortedEvents).reverse()
      .find(({ what }) => what === DEAL);
    return sortedEvents.slice(sortedEvents.lastIndexOf(dealEvent));
  },
);

const getCrib = createSelector(
  [getEventsForCurrentRound],
  events => events
    .filter(({ what }) => what === DISCARD)
    .map(({ cards }) => cards)
    .reduce((acc, curr) => acc.concat(curr), []),
);

export const getStage = createSelector(
  [lastEventSelector, getCrib, getEventsForCurrentRound],
  (lastEvent, crib, events) => {
    const peggedCards = events.filter(({ what }) => what === PLAY_PEG_CARD);
    const lastPeggedCardIdx = events.indexOf(peggedCards[peggedCards.length - 1]);
    const lastGo = events[lastPeggedCardIdx + 1] || {};
    const tookGoForLastCard = peggedCards.length === 8 && (lastGo.what === TAKE_A_GO);
    const needsDiscard = crib.length < 4;
    const hasDoneCut = events.find(({ what }) => what === START_PEGGING);
    const { what: lastEventType } = lastEvent || {};
    if (lastEventType === CUT_FOR_FIRST_CRIB || lastEventType === START) {
      return 0;
    } else if (needsDiscard) {
      return 1;
    } else if (!hasDoneCut) {
      return 2;
    } else if (!tookGoForLastCard) {
      return 3;
    }
    return 4;
  },
);

export const getCut = createSelector(
  [getEventsForCurrentRound],
  (sortedEvents) => {
    const cutEvent = R.reverse(sortedEvents).find(({ what }) => what === FLIP_FIFTH_CARD);
    if (cutEvent) {
      return cutEvent.cards[0];
    }
    return '';
  },
);

