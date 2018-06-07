import { createSelector } from 'reselect';
import { valueOf } from '../../deck';
import { CUT_FOR_FIRST_CRIB } from '../../types/events';

export const getFirstCuts = (gameEvents) => {
  const cutEvents = gameEvents.filter(evt => evt.what === CUT_FOR_FIRST_CRIB);
  return {
    first: cutEvents[0] || null,
    second: cutEvents[1] || null,
    __typename: 'CutsInfo',
  };
};

export const getFirstCut = cuts => cuts.first && cuts.first.cards[0];

export const getSecondCut = cuts => cuts.second && cuts.second.cards[0];

export const getShownCuts = createSelector(
  getFirstCut,
  getSecondCut,
  (firstCut, secondCut) => [firstCut, secondCut],
);

export const hasCutForFirstCrib = (cuts, { userid }) => {
  const { first, second } = cuts;
  return (first && first.who) === userid || (second && second.who) === userid;
};

export const getFirstCribWinner = ({ first: firstCut, second: secondCut }) => {
  if (!firstCut || !secondCut) return false;
  const isFirstLower = valueOf(firstCut.cards[0]) < valueOf(secondCut.cards[0]);
  if (valueOf(firstCut.cards[0]) === valueOf(secondCut.cards[0])) return 'TIE!';
  else if (isFirstLower) return firstCut.who;
  return secondCut.who;
};

