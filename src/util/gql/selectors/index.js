import * as stages from '../../types/stages';

const { createSelector } = require('reselect');
const {
  CUT_FOR_FIRST_CRIB,
  START,
  DEAL,
  DISCARD,
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
    if (sortedEvents.length) return Array.from(sortedEvents).pop();
    return null;
  },
);


export const getEventsForCurrentRound = createSelector(
  [sortByTimeSelector],
  (sortedEvents) => {
    const dealEvent = Array.from(sortedEvents).reverse()
      .find(({ what }) => what.includes(DEAL));
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
    const { what: lastEventType } = lastEvent || {};
    if (lastEventType === CUT_FOR_FIRST_CRIB || lastEventType === START) {
      return stages.DETERMINING_FIRST_CRIB;
    } else if (needsDiscard) {
      return stages.DISCARDING_TO_CRIB;
    } else if (!tookGoForLastCard) {
      return stages.PLAYING_PEGGING_CARDS;
    }
    return stages.COUNTING_HAND;
  },
);

