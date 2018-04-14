import { createSelector } from 'reselect';

function sortByTimeSelector(gameEvents) {
  if (!gameEvents) return [];
  return Object.values(gameEvents).sort((ev1, ev2) => ev1.timestamp > ev2.timestamp);
}

const currentUserSelector = (gameEvents, props) => props.currentUser;

function firstCutSelector(gameEvents) {
  if (!gameEvents) return null;
  return Object.values(gameEvents).find(item => item.what === 'first cut');
}

function secondCutSelector(gameEvents) {
  if (!gameEvents) return null;
  return Object.values(gameEvents).find(item => item.what === 'second cut');
}

const lastEventSelector = createSelector(
  [sortByTimeSelector],
  sortedEvents => sortedEvents.length && sortedEvents[sortedEvents.length - 1],
);

export const needsFirstCutSelector = createSelector(
  [lastEventSelector],
  lastEvent => lastEvent.what === 'start',
);

export const needsSecondCutSelector = createSelector(
  [lastEventSelector],
  lastEvent => lastEvent.what === 'first cut',
);


// need to pass props to this with currentUser (get rid of this):
export const currentUserDidFirstCutSelector = createSelector(
  [currentUserSelector, lastEventSelector],
  (currentUser, lastEvent) => lastEvent.who === currentUser && lastEvent.what === 'first cut',
);

export const shownCutsSelector = createSelector(
  [firstCutSelector, secondCutSelector],
  (firstCut, secondCut) => {
    if (firstCut && secondCut) {
      return [firstCut, secondCut];
    } else if (firstCut) {
      return [firstCut];
    }
    return [];
  },
);

export const deckSelector = createSelector(
  [sortByTimeSelector],
  (sortedEvents) => {
    const deckEvent = sortedEvents.reverse().find(({ deck }) => !!deck);
    if (deckEvent) {
      return JSON.parse(deckEvent.deck);
    }
    return [];
  },
);
