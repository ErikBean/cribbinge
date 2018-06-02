import { createSelector } from 'reselect';

import { getEventsForCurrentRound } from './index';
import { getPlayedCards } from './played';

const getUserIdArg = (_, args) => {
  if (!args || !args.userid) {
    return console.trace('no userid!');
  }
  return args.userid;
};

export const getDealtHand = createSelector(
  [getEventsForCurrentRound, getUserIdArg],
  (sortedEvents, userid) => {
    const dealEvent = sortedEvents.find(({ what }) => what.includes('deal round'));
    if (dealEvent) {
      return dealEvent.cards[userid];
    }
    return [];
  },
);

export const getCurrentHand = createSelector(
  [getEventsForCurrentRound, getDealtHand, getPlayedCards, getUserIdArg],
  (events, dealtHand, peggingEvents, userid) => {
    let hand = dealtHand;
    const discardEvt = Array.from(events).reverse()
      .find(({ what, who }) => what === 'discard' && who === userid);
    if (discardEvt) {
      const { cards: discards } = discardEvt;
      hand = dealtHand.filter(card => discards.indexOf(card) === -1);
    }
    if (peggingEvents.length) {
      const played = peggingEvents.map(({ card }) => card);
      hand = hand.filter(card => played.indexOf(card) === -1);
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
