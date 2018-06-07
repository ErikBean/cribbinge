import { createSelector } from 'reselect';

import { getEventsForCurrentRound, getStage } from './index';
import { getPlayedCards } from './played';
import { DEAL, DISCARD } from '../../types/events';

const getUserIdArg = (_, args) => {
  if (!args || !args.userid) {
    return console.trace('no userid!');
  }
  return args.userid;
};

export const getDealtHand = createSelector(
  [getEventsForCurrentRound, getUserIdArg],
  (sortedEvents, userid) => {
    const dealEvent = sortedEvents.find(({ what }) => what.includes(DEAL));
    if (dealEvent) {
      return dealEvent.cards[userid];
    }
    return [];
  },
);

export const getCurrentHand = createSelector(
  [getEventsForCurrentRound, getDealtHand, getPlayedCards, getStage, getUserIdArg],
  (events, dealtHand, peggingEvents, stage, userid) => {
    if (stage === 1) {
      return dealtHand;
    }
    let hand = dealtHand;
    const discardEvt = Array.from(events).reverse()
      .find(({ what, who }) => what === DISCARD && who === userid);
    if (discardEvt) {
      const { cards: discards } = discardEvt;
      hand = dealtHand.filter(card => discards.indexOf(card) === -1);
    }
    if (stage === 3) {
      return hand;
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
