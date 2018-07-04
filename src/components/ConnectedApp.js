import { connect } from 'react-firebase';
import App from './App';
import { createDeck, shuffle } from '../util/deck';
import { START } from '../util/types/events';
import { query } from '../util/gql/resolvers';

export default connect((props, ref) => ({
  users: 'users',
  addUser: value => ref(`users/${value}/online`).set('true'),
  startMatch: (gameId, name) => ref(`games/${gameId}`).push({
    __typename: 'Event',
    cards: shuffle(createDeck()),
    timestamp: Date.now(),
    what: START,
    who: name,
  }),
  archive: (gameId) => {
    ref(`games/${gameId}`).set(null);
    ref(`archive/${gameId}-${Date.now()}`).set(JSON.stringify(window.ac.readQuery({ query }).gameEvents));
  },
}))(App);
