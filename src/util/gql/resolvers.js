import gql from 'graphql-tag';
import { getDeck, getStage } from './resolverHelpers';
import {
  getFirstCuts,
  hasCutForFirstCrib,
  getShownCuts,
  getFirstCribWinner
} from './resolverHelpers/firstCrib';

export const defaults = {
  todos: [],
  visibilityFilter: 'SHOW_ALL',
  gameEvents: [],
};

const nextTodoId = 0;

export const resolvers = {
  Query: {
    game2(_, { id }, { cache }) {
      const query = gql`{
        gameEvents {
          timestamp
          what
          who
          cards
        }
      }`;
      const events = cache.readQuery({ query }).gameEvents;
      return {
        id,
        events,
        deck: getDeck(events),
        stage: getStage(events),
        cutsForFirstCrib: getFirstCuts(events),
        __typename: 'Game',
      };
    },
  },
  CutsInfo: {
    hasCutForFirstCrib(cuts, { userid }) {
      return hasCutForFirstCrib(cuts, {userid});
    },
    shownCuts(cuts){
      return getShownCuts(cuts);
    },
    winner(cuts){
      return getFirstCribWinner(cuts);
    }
  },
  Mutation: {
    addTodo: (_, { text }, { cache }) => {
      const query = gql`
        query GetTodos {
          todos @client {
            id
            text
            completed
          }
        }
      `;
      const previous = cache.readQuery({ query });
      const newTodo = {
        id: nextTodoId + 1,
        text,
        completed: false,
        __typename: 'TodoItem',
      };
      const data = {
        todos: previous.todos.concat([newTodo]),
      };
      cache.writeData({ data });
      return newTodo;
    },
    toggleTodo: (_, variables, { cache }) => {
      const id = `TodoItem:${variables.id}`;
      const fragment = gql`
        fragment completeTodo on TodoItem {
          completed
        }
      `;
      const todo = cache.readFragment({ fragment, id });
      const data = { ...todo, completed: !todo.completed };
      cache.writeData({ id, data });
      return null;
    },
  },
};

export default resolvers;
