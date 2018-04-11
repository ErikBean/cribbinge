function sortByTime(gameEvents){
  if(!gameEvents) return []
  return Object.values(gameEvents).sort((ev1, ev2) => {
    return ev1.timestamp > ev2.timestamp;
  })
}

function lastEvent(events){
  const sortedEvents = sortByTime(events);
  return sortedEvents.length && sortedEvents[sortedEvents.length -1];
}

function lastEventIs(eventName){
  return function (events){
    return lastEvent(events).what === eventName;
  }
}

function lastEventDoneBy(userName){
  return function (events){
    return lastEvent(events).who === userName;
  }
}

export function needsFirstCut (gameEvents = {}) {
  const lastEventIsStart = lastEventIs('start');
  return lastEventIsStart(gameEvents);
}

export function firstCut(gameEvents){
  const event = Object.values(gameEvents).find((item) => {return item.what === 'first cut'})
  return event && event.data.card;
}

export function needsSecondCut (gameEvents) {
  const lastEventIsFirstCut = lastEventIs('first cut');
  return lastEventIsFirstCut(gameEvents)
}

export function currentUserDidFirstCut(currentUser, gameEvents){
  const lastEventIsFirstCut = lastEventIs('first cut');
  const lastEventDoneByCurrentUser = lastEventDoneBy(currentUser);
  return lastEventIsFirstCut(gameEvents) && lastEventDoneByCurrentUser(gameEvents);
}