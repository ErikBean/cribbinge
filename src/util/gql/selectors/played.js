import { createSelector } from 'reselect';
import { getEventsForCurrentRound } from './index';
import { PLAY_PEG_CARD } from '../../types/events';

export const getPeggingEvents = createSelector(
  [getEventsForCurrentRound],
  events => events.filter(evt => evt.what === PLAY_PEG_CARD),
);

export const getPlayedCards = createSelector(
  [getPeggingEvents],
  events => events.map(evt => ({
    card: evt.cards[0],
    playedBy: evt.who,
    __typename: 'PegCard',
  })),
);
