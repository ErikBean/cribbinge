import { createSelector } from 'reselect';
import { getFirstCuts, getFirstCribWinner } from './firstCrib';
import { getEventsForCurrentRound } from './index';

const getUserIdArg = (_, { userid }) => userid;

const getCribCards = createSelector(
  [getEventsForCurrentRound],
  events => events
    .filter(({ what }) => what === 'discard')
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
    if (events[0].what.includes('deal')) {
      return events[0].who === userid;
    }
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
