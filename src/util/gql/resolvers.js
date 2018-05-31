import gql from 'graphql-tag';
import { getDeck, getStage } from './selectors';
import {
  getFirstCuts,
  hasCutForFirstCrib,
  getShownCuts,
  getFirstCribWinner,
} from './selectors/firstCrib';
import { getHand } from './selectors/hand';
import { getCrib } from './selectors/crib';

export const defaults = {
  todos: [],
  visibilityFilter: 'SHOW_ALL',
  gameEvents: [],
};

const nextTodoId = 0;

const query = gql`{
  gameEvents {
    timestamp
    what
    who
    cards
  }
}`;
export const resolvers = {
  Query: {
    game(_, { id }, { cache }) {
      const events = cache.readQuery({ query }).gameEvents;
      return {
        id,
        events,
        deck: getDeck(events),
        stage: getStage(events),
        cutsForFirstCrib: getFirstCuts(events),
        crib: getCrib(events),
        __typename: 'Game',
      };
    },
    pegging(_, __, { cache }) {
      const events = cache.readQuery({ query }).gameEvents;
      return {
        playedCards: [],
        __typename: 'PeggingInfo',
      };
    },
  },
  Game: {
    hand(game, { userid }) {
      return getHand(game.events, { userid });
    },
  },
  PeggingInfo: {
    hasAGo(pegInfo, {userid}){
      return false
    },
    playedBy(pegInfo, {userid}){
      return []
    },
    canPlay(pegInfo, {userid}){
      return false;
    }
  },
  CutsInfo: {
    hasCutForFirstCrib(cuts, { userid }) {
      return hasCutForFirstCrib(cuts, { userid });
    },
    shownCuts(cuts) {
      return getShownCuts(cuts);
    },
    winner(cuts) {
      return getFirstCribWinner(cuts);
    },
  }
};

export default resolvers;
