const { createSelector } = require('reselect');
// const { valueOf } = require('../../deck');

export function sortByTimeSelector(gameEvents) {
  if (!gameEvents) return [];
  return Object.values(gameEvents).sort((ev1, ev2) => ev1.timestamp > ev2.timestamp);
}

export const getDeck = createSelector(
  [sortByTimeSelector],
  (sortedEvents) => {
    const deckEvent = sortedEvents.reverse().find(({ what }) => what === 'start');
    if (deckEvent) {
      return deckEvent.cards;
    }
    return [];
  },
);

const lastEventSelector = createSelector(
  [sortByTimeSelector],
  (sortedEvents) => {
    if (sortedEvents.length) return sortedEvents.reverse()[0];
    return null;
  },
);


export const getEventsForCurrentRound = createSelector(
  [sortByTimeSelector],
  (sortedEvents) => {
    const dealEvent = Array.from(sortedEvents).reverse()
      .find(({ what }) => what.includes('deal round'));
    return sortedEvents.slice(sortedEvents.lastIndexOf(dealEvent));
  },
);

const getCrib = createSelector(
  [getEventsForCurrentRound],
  events => events
    .filter(({ what }) => what === 'discard')
    .map(({ cards }) => cards)
    .reduce((acc, curr) => acc.concat(curr), []),
);

export const getStage = createSelector(
  [lastEventSelector, getCrib],
  (lastEvent, crib) => {
    const needsDiscard = crib.length < 4;
    if (!lastEvent || lastEvent.what === 'cut for first crib' || lastEvent.what === 'start') {
      return 0;
    } else if (needsDiscard) {
      return 1;
    }
    return 2;
  },
);

