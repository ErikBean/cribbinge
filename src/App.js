import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import CssBaseline from 'material-ui/CssBaseline';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import Drawer from './Drawer';
import GamesList from './GamesList';
import Users from './Users';
import Game from './Game';
import AppBar from './AppBar';

import { needsOpponentSelector } from './util/projections';

const client = new ApolloClient({
  // uri: "https://us-central1-crabapple-f6555.cloudfunctions.net/api/graphql", // serve from cloud function
  uri: 'http://localhost:5000/crabapple-f6555/us-central1/api/graphql', // serve locally
  credentials: true,
});

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
const LOCALSTORAGE_KEY = 'cribbagePatch.activeGame';

export default class App extends Component {
  // The component's Local state.
  state = {
    activeGame: window.localStorage.getItem(LOCALSTORAGE_KEY),
    drawerOpen: false,
    name: '', // current user's email before the @ sign
    signedIn: false, // Local signed-in state.
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
  }
  
  // Listen to the Firebase Auth state and set the local state.
  componentWillMount() {
    const activeGame = window.localStorage.getItem(LOCALSTORAGE_KEY);
    if(activeGame) this.setState({ activeGame })
  }
  
  componentDidMount() {
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }
  
  setActiveGame = (gameId) => {
    if(gameId === this.state.activeGame) return this.toggleDrawer();
    this.setState({
      activeGame: gameId
    }, () => {
      if(this.state.drawerOpen) this.toggleDrawer();
      window.localStorage.setItem(LOCALSTORAGE_KEY, gameId);
    });
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

  toggleDrawer = () => {
    this.setState({drawerOpen: !this.state.drawerOpen})
  }
  
  startMatch = (withUser) => {
    const gameId = `${this.state.name}-${withUser}`;
    this.props.startMatch(gameId);
    this.setActiveGame(gameId);
  }
  
  render() {
    return (
      <ApolloProvider client={client}>
        <React.Fragment>
          <CssBaseline />
          <AppBar onMenuClick={this.toggleDrawer}/>
          <Drawer open={this.state.drawerOpen} toggleDrawer={this.toggleDrawer}>
            <GamesList currentUser={this.state.name} setActiveGame={this.setActiveGame}/>
          </Drawer>
          {!this.state.signedIn &&
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
          }
          {this.state.signedIn &&
            <React.Fragment>
              {
                this.state.activeGame
                  ? (
                    <Game
                      gameId={this.state.activeGame}
                      currentUser={this.state.name}
                    />
                  ) : (
                    <Users
                      users={this.props.users || {}}
                      userClicked={this.startMatch}
                    />
                  )
              }
            </React.Fragment>
          }
        </React.Fragment>
      </ApolloProvider>
    );
  }
}

App.propTypes = {
  addUser: PropTypes.func.isRequired,
  startMatch: PropTypes.func.isRequired,
  games: PropTypes.shape({}),
  users: PropTypes.shape({}),
}

App.defaultProps = {
  games: {},
  users: {},
}
