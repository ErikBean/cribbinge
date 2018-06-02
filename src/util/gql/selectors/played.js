import { createSelector } from 'reselect';
import { getEventsForCurrentRound } from './index';

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
