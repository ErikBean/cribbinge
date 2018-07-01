import gql from 'graphql-tag';
import { getDeck, getStage, getCut } from './selectors';
import {
  getFirstCuts,
  hasCutForFirstCrib,
  getShownCuts,
  getFirstCribWinner,
} from './selectors/firstCrib';
import { getHand } from './selectors/hand';
import { getCrib, getIsMyCrib } from './selectors/crib';
import {
  canPlayCard,
  doesOpponentHaveAGo,
  getPeggingEvents,
  getPegTotal,
  getPlayedCards,
} from './selectors/pegging';
import { getPeggingPoints, getPegs, getHandPoints } from './selectors/points';

export const defaults = {
  gameEvents: [],
};

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
    game(_, args, { cache }) {
      const events = cache.readQuery({ query }).gameEvents;
      return {
        id: (args || {}).id,
        events,
        deck: getDeck(events),
        stage: getStage(events),
        cutsForFirstCrib: getFirstCuts(events),
        crib: getCrib(events),
        cut: getCut(events),
        __typename: 'Game',
      };
    },
  },
  Crib: {
    isMyCrib(crib, { userid }, { cache }) {
      const events = cache.readQuery({ query }).gameEvents;
      return getIsMyCrib(events, { userid });
    },
  },
  Game: {
    hand(game, { userid }) {
      return getHand(game.events, { userid });
    },
    pegging(game, { userid }) {
      return {
        currentHand: getHand(game.events, { userid }).cards,
        events: getPeggingEvents(game.events),
        playedCards: getPlayedCards(game.events, { userid }),
        canPlay: canPlayCard(game.events, { userid }),
        total: getPegTotal(game.events),
        __typename: 'PeggingInfo',
      };
    },
    points(game, { userid, opponentid }) {
      return {
        hand: getHandPoints(game.events, { userid }),
        pegging: getPeggingPoints(game.events, { userid, opponentid }),
        pegs: getPegs(game.events, { userid }),
        crib: {},
        __typename: 'AllPoints',
      };
    },
  },
  Points: {

  },
  PeggingInfo: {
    hasAGo(/* pegInfo */) {
      return false;
    },
    opponentHasAGo(pegInfo, { userid }, { cache }) {
      const events = cache.readQuery({ query }).gameEvents;
      return doesOpponentHaveAGo(pegInfo, { userid }, events);
    },
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
  },
};

export default resolvers;
