import { createSelector } from 'reselect';
import {getEventsForCurrentRound}  from './index';

const getCribCards = createSelector(
  [getEventsForCurrentRound],
  (events) => {
    return events
    .filter(({what}) => what === 'discard')
    .map(({cards}) => cards)
    .reduce((acc, curr) => acc.concat(curr), []);
  }
)

export const getCrib = createSelector(
  [getCribCards],
  (cards) => {
    return {
      cards,
      hasAllCards: cards.length === 4,
      __typename: 'Crib',
    }
  }
);