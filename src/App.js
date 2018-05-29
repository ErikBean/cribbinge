import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import gql from 'graphql-tag';
import 'firebase/auth';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import CssBaseline from 'material-ui/CssBaseline';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import ApolloWrapper from './ApolloWrapper';
import AppBar from './AppBar';
import Drawer from './Drawer';
import GameQuery from './GameQuery';
import GamesList from './GamesList';
import GameUpdater from './GameUpdater';
import Users from './Users';


const client = new ApolloClient({
  // uri: "https://us-central1-crabapple-f6555.cloudfunctions.net/api/graphql", // serve from cloud function
  uri: 'http://localhost:5000/crabapple-f6555/us-central1/api/graphql', // serve locally
  credentials: true,
  clientState: {
    
  },
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
    activeGame: window.localStorage.getItem(LOCALSTORAGE_KEY) || '',
    drawerOpen: false,
    name: '', // current user's email before the @ sign
    signedIn: false, // Local signed-in state.
  }

  // Listen to the Firebase Auth state and set the local state.
  componentWillMount() {
    const activeGame = window.localStorage.getItem(LOCALSTORAGE_KEY);
    if (activeGame) this.setState({ activeGame });
  }

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

  setActiveGame = (gameId) => {
    if (gameId === this.state.activeGame) {
      this.closeDrawer();
      return;
    }
    this.setState({
      activeGame: gameId,
    }, () => {
      window.localStorage.setItem(LOCALSTORAGE_KEY, gameId);
      this.closeDrawer();
    });
  }

  closeDrawer = () => {
    if (this.state.drawerOpen) {
      this.toggleDrawer();
    }
  }

  toggleDrawer = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  }

  startMatch = (withUser) => {
    const gameId = `${this.state.name}-${withUser}`;
    this.props.startMatch(gameId, this.state.name);
    this.setActiveGame(gameId);
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
      signInSuccessWithAuthResult: result => console.log('auth state:', result),
    },
  }

  render() {
    return (
        <React.Fragment>
          <CssBaseline />
          {/* <GameUpdater gameId={this.state.activeGame} apolloClient={client}/> */}
          <AppBar onMenuClick={this.toggleDrawer} />
          {!this.state.signedIn &&
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
          }
          {this.state.signedIn &&
            <ApolloWrapper gameId={this.state.activeGame}>
              <Drawer open={this.state.drawerOpen} toggleDrawer={this.toggleDrawer}>
                <GamesList
                  currentUser={this.state.name}
                  setActiveGame={this.setActiveGame}
                  activeGame={this.state.activeGame}
                />
              </Drawer>
              {
                this.state.activeGame
                  ? (
                    <GameQuery
                      gameId={this.state.activeGame}
                      currentUser={this.state.name}
                    />
                  ) : (
                    <Users
                      currentUser={this.state.name}
                      users={this.props.users || {}}
                      userClicked={this.startMatch}
                    />
                  )
              }
            </ApolloWrapper>
          }
        </React.Fragment>
        );
  }
}

App.propTypes = {
  addUser: PropTypes.func.isRequired,
  startMatch: PropTypes.func.isRequired,
  users: PropTypes.shape({}),
};

App.defaultProps = {
  users: {},
};
