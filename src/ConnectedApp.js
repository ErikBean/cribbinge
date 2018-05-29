import { connect } from 'react-firebase';
import App from './App';
import { createDeck, shuffle } from './util/deck';

export default connect((props, ref) => ({
  users: 'users',
  addUser: value => ref(`users/${value}/online`).set('true'),
  startMatch: (gameId, name) => ref(`games/${gameId}`).push({
    __typename: 'Event',
    cards: shuffle(createDeck()),
    timestamp: Date.now(),
    what: 'start',
    who: name,
  }),
}))(App);
