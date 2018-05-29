const { createSelector } = require('reselect');
const { sortByTimeSelector } = require('./index');
const {valueOf} = require('../../deck');

export const getFirstCut = (cuts) => {
  if(!cuts.length){
    return null;
  }
  return sortByTimeSelector(cuts).pop();
}

export const getSecondCut = (cuts) => {
  // what if there is only 1 cut ?
  if(cuts.length < 2){
    return null;
  }
  return sortByTimeSelector(cuts).reverse().pop();
}

export const getFirstCuts = (gameEvents, args) => {
  const cutEvents = gameEvents.filter(evt => evt.what === 'cut for first crib');
  return {
    first: cutEvents[0] || null,
    second: cutEvents[1] || null,
    __typename: 'CutsInfo'
  }
}

export const hasCutForFirstCrib = (cuts, {userid}) => {
  return cuts
    .map(cut => cut.who === userid)
    .reduce((acc, curr) => {
      acc = acc || curr;
      return acc;
    }, false);
}

export const getFirstCribWinner = createSelector(
  [getFirstCut, getSecondCut],
  (firstCut, secondCut) => {
    if(!firstCut || !secondCut) return false;
    const isFirstLower = valueOf(firstCut.cards[0]) < valueOf(secondCut.cards[0]);
    if(valueOf(firstCut.cards[0]) === valueOf(secondCut.cards[0])) return 'TIE!';
    else if(isFirstLower) return firstCut.who;
    return secondCut.who;
  }
)

