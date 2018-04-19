import { createSelector } from 'reselect';
import { getNumberOrFace, getSuit } from '../deck';
import {needsFirstCutSelector, needsSecondCutSelector, firstCutSelector, currentUserDidFirstCutSelector} from './index';



export const messageSelector = createSelector(
  [
    needsFirstCutSelector,
    needsSecondCutSelector,
    firstCutSelector,
    (a,b,opp) => opp,
    currentUserDidFirstCutSelector,
  ],
  (needsFirstCut, needsSecondCut, firstCut, opponent, currentUserDidFirstCut) => {
    if(needsFirstCut){
      return {
        mainMessage: 'Cut for the first crib',
        subMessage: 'Use the slider to cut the deck then click a card to flip',
      };
    } else if(needsSecondCut && currentUserDidFirstCut){
      return {
        mainMessage: `You cut a ${getNumberOrFace(firstCut.card)}!`,
        subMessage: 'Use the slider to cut the deck then click a card to flip',
      };
    } else if(needsSecondCut){
      return {
        mainMessage: `${opponent} cut a ${getNumberOrFace(firstCut.card)}!`,
        subMessage: 'Use the slider to cut the deck then click a card to flip',
      };
    } 
    return {
      mainMessage: 'Loading',
      subMessage: 'please wait',
    }
  }
)
