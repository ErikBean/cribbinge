import { createSelector } from 'reselect';

import { sortByTimeSelector, getEventsForCurrentRound } from './index';

export const HAND_SIZE = 4;
const getUserIdArg = (_, { userid }) => userid;

export const getDealtHand = createSelector(
  [sortByTimeSelector, getUserIdArg],
  (sortedEvents, userid) => {
    const dealEvent = Array.from(sortedEvents).reverse().find(({ what }) => what.includes('deal round'));
    if (dealEvent) {
      return dealEvent.cards[userid];
    }
    return [];
  },
);

export const getCurrentHand = createSelector(
  [sortByTimeSelector, getDealtHand, getEventsForCurrentRound, getUserIdArg],
  (sortedEvents, dealtHand, events, userid) => {
    let hand = dealtHand;
    const discardEvt = Array.from(sortedEvents).reverse()
      .find(({ what, who }) => what === 'discard' && who === userid);
    if (discardEvt) {
      const { cards: discards } = discardEvt;
      hand = dealtHand.filter(card => discards.indexOf(card) === -1);
    }
    return hand;
  },
);

export const getHand = createSelector(
  [getCurrentHand],
  hand => ({
    cards: hand,
    hasDiscarded: hand.length === 4,
    __typename: 'Hand',
  }),
);
