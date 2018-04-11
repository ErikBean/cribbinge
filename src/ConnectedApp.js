import { connect } from 'react-firebase'
import App from './App';

export default connect((props, ref) => ({
  users: 'users',
  games: 'games',
  addUser: value => ref(`users/${value}/online`).set('true'),
  startMatch: gameId => ref(`games/${gameId}`).push({what: 'start', timestamp: Date.now()}),
}))(App)
