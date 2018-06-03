const { createSelector } = require('reselect');
// const { valueOf } = require('../../deck');

export function sortByTimeSelector(gameEvents) {
  if (!gameEvents) return [];
  // its already sorted
  return gameEvents;
}

export const getDeck = createSelector(
  [sortByTimeSelector],
  (sortedEvents) => {
    const deckEvent = Array.from(sortedEvents).reverse().find(({ what }) => what === 'start');
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
  [lastEventSelector, getCrib, getEventsForCurrentRound],
  (lastEvent, crib, events) => {
    const peggedCards = events.filter(({what}) => what === 'play pegging card');
    const needsDiscard = crib.length < 4;
    if (!lastEvent || lastEvent.what === 'cut for first crib' || lastEvent.what === 'start') {
      return 0;
    } else if (needsDiscard) {
      return 1;
    } else if(peggedCards.length < 8){
      return 2;
    }
    return 3
  },
);

