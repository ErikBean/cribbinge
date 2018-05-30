const { createSelector } = require('reselect');
const { sortByTimeSelector } = require('./index');
const { valueOf } = require('../../deck');

export const getFirstCuts = (gameEvents) => {
  const cutEvents = gameEvents.filter(evt => evt.what === 'cut for first crib');
  return {
    first: cutEvents[0] || null,
    second: cutEvents[1] || null,
    __typename: 'CutsInfo',
  };
};

export const getFirstCut = (cuts) => {
  return cuts.first && cuts.first.cards[0];
};

export const getSecondCut = (cuts) => {
  return cuts.second && cuts.second.cards[0];
};

export const getShownCuts = createSelector(
  getFirstCut,
  getSecondCut,
  (firstCut, secondCut) => {
    return [firstCut, secondCut]
  }
)

export const hasCutForFirstCrib = (cuts, { userid }) => {
  const {first, second} = cuts;
  return (first && first.who) === userid || (second && second.who) === userid;
}

export const getFirstCribWinner = ({first: firstCut, second: secondCut}) => {
  if (!firstCut || !secondCut) return false;
  const isFirstLower = valueOf(firstCut.cards[0]) < valueOf(secondCut.cards[0]);
  if (valueOf(firstCut.cards[0]) === valueOf(secondCut.cards[0])) return 'TIE!';
  else if (isFirstLower) return firstCut.who;
  return secondCut.who;
};

