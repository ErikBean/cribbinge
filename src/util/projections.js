import { createSelector } from 'reselect'

function sortByTimeSelector(gameEvents){
  if(!gameEvents) return []
  return Object.values(gameEvents).sort((ev1, ev2) => {
    return ev1.timestamp > ev2.timestamp;
  })
}

const currentUserSelector = (gameEvents, props) => props.currentUser;

function firstCutSelector(gameEvents){
  if(!gameEvents) return null;
  return Object.values(gameEvents).find((item) => {return item.what === 'first cut'})
}

function secondCutSelector(gameEvents){
  if(!gameEvents) return null;
  return Object.values(gameEvents).find((item) => {return item.what === 'second cut'})
}

const lastEventSelector = createSelector(
  [sortByTimeSelector],
  (sortedEvents)=> {
    return sortedEvents.length && sortedEvents[sortedEvents.length -1];
  }
);


const lastEventDoneByCurrentUserSelector = createSelector(
  [lastEventSelector, currentUserSelector],
  (lastEvent, currentUser) => {
    return lastEvent.who === currentUser;
  }
)

export const needsFirstCutSelector = createSelector(
  [lastEventSelector],
  (lastEvent) => {
    return lastEvent.what === 'start';
  }
)

export const needsSecondCutSelector = createSelector(
  [lastEventSelector],
  (lastEvent) => {
    return lastEvent.what === 'first cut';
  }
)


//need to pass props to this with currentUser (get rid of this): 
export const currentUserDidFirstCutSelector = createSelector(
  [currentUserSelector, lastEventSelector],
  (currentUser, lastEvent) => {
    return lastEvent.who === currentUser && lastEvent.what === 'first cut';
  }
);

export const shownCutsSelector = createSelector(
  [firstCutSelector, secondCutSelector],
  (firstCut, secondCut) => {
    if(firstCut && secondCut){
      return [firstCut, secondCut]
    } else if(firstCut){
      return [firstCut]
    } else {
      return [];
    }
  }
)