import React, { Component } from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import CssBaseline from 'material-ui/CssBaseline';
import PropTypes from 'prop-types';

import CounterThing from './CounterThing';
import Users from './Users';
import Games from './Games';
import AppBar from './AppBar';
// import InfoBar from './InfoBar';

import { needsOpponentSelector } from './util/projections';

const config = {
  apiKey: 'AIzaSyAifgF5ZKTGRN3MJQ2CjWEgcyGJZ3O28Tg',
  authDomain: 'crabapple-f6555.firebaseapp.com',
  databaseURL: 'https://crabapple-f6555.firebaseio.com',
  projectId: 'crabapple-f6555',
  storageBucket: 'crabapple-f6555.appspot.com',
  messagingSenderId: '801912982668',
};

firebase.initializeApp(config);
window.firebase = firebase;

export default class App extends Component {
  static propTypes = {
    addUser: PropTypes.func.isRequired,
    startMatch: PropTypes.func.isRequired,
    games: PropTypes.shape({}),
    users: PropTypes.shape({}),
  }
  static defaultProps = {
    games: {},
    users: {},
  }
  // The component's Local state.
  state = {
    signedIn: false, // Local signed-in state.
    name: '', // current user's email before the @ sign
  };
  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  onAuthStateChanged = (user) => {
    this.setState({
      signedIn: !!user,
      name: user && user.email.split('@')[0],
    });
    if (user) {
      this.props.addUser(user.email.split('@')[0]);
    }
  }
  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccess: () => console.log('signed in!'),
    },
  };

  startMatch = (withUser) => {
    const gameId = `${this.state.name}-${withUser}`;
    this.props.startMatch(gameId);
  }
  render() {
    if (!this.state.signedIn) {
      return (
        <React.Fragment>
          <CssBaseline />
          <AppBar classes={{}} />
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar classes={{}} />
        {/* <InfoBar /> */}
        <Users
          users={this.props.users || {}}
          needsOpponent={needsOpponentSelector(this.props.games, this.state.name)}
          userClicked={this.startMatch}
        />
        <Games
          games={this.props.games || {}}
          currentUser={this.state.name}
        />
        <CounterThing />
      </React.Fragment>
    );
  }
}
