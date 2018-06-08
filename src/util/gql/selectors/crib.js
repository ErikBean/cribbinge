import { createSelector } from 'reselect';
import { getFirstCuts, getFirstCribWinner } from './firstCrib';
import { getEventsForCurrentRound } from './index';
import { DISCARD, DEAL } from '../../types/events';

const getUserIdArg = (_, { userid }) => userid;

const getCribCards = createSelector(
  [getEventsForCurrentRound],
  events => events
    .filter(({ what }) => what === DISCARD)
    .map(({ cards }) => cards)
    .reduce((acc, curr) => acc.concat(curr), []),
);

const getFirstCutWinner = createSelector(
  [getFirstCuts],
  firstCuts => getFirstCribWinner(firstCuts),
);

export const getIsMyCrib = createSelector(
  [getEventsForCurrentRound, getFirstCutWinner, getUserIdArg],
  (events, firstCribWinner, userid) => {
    if (events.length && events[0].what === DEAL) {
      return events[0].who === userid;
    }
    // TODO: when we can determine what round it is, do Boolean(round%2)
    return firstCribWinner === userid;
  },
);

export const getCrib = createSelector(
  [getCribCards],
  cards => ({
    cards,
    hasAllCards: cards.length === 4,
    __typename: 'Crib',
  }),
);
