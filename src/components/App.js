import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import CssBaseline from 'material-ui/CssBaseline';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import Divider from '@material-ui/core/Divider';

import ApolloWrapper from './ApolloWrapper';
import AppBar from './AppBar';
import Drawer from './Drawer';
import GameQuery from './GameQuery';
import GamesList from './GamesList';
import Users from './Users';

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
    dialogOpen: true,
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

  handleDialogClose = () => {
    this.setState({
      dialogOpen: false,
    });
  }

  clearActiveGame = (gameId) => {
    console.log('>>> Here: ', gameId);
    if (gameId === this.state.activeGame) {
      this.setState({
        activeGame: '',
        dialogOpen: true,
      }, () => {
        window.localStorage.removeItem(LOCALSTORAGE_KEY);
        this.props.archive(gameId);
      });
    } else {
      this.props.archive(gameId);
    }
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

  renderGamesList = () => (
    <GamesList
      clearActiveGame={this.clearActiveGame}
      currentUser={this.state.name}
      setActiveGame={this.setActiveGame}
      activeGame={this.state.activeGame}
    />
  )

  renderUsersList = () => (
    <Users
      currentUser={this.state.name}
      users={this.props.users}
      userClicked={this.startMatch}
    />
  )

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar onMenuClick={this.toggleDrawer} />
        {!this.state.signedIn &&
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
        }
        {this.state.signedIn &&
          <ApolloWrapper gameId={this.state.activeGame}>
            <Drawer open={this.state.drawerOpen} toggleDrawer={this.toggleDrawer}>
              {this.renderGamesList()}
              <Divider />
              {this.renderUsersList()}
            </Drawer>
            {
                this.state.activeGame
                  ? (
                    <GameQuery
                      gameId={this.state.activeGame}
                      currentUser={this.state.name}
                      clearActiveGame={this.clearActiveGame}
                    />
                  ) : (
                    <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
                      <DialogTitle>Select a New Opponent</DialogTitle>
                      {this.renderUsersList()}
                      <DialogTitle>Or Choose an Existing Game</DialogTitle>
                      {this.renderGamesList()}
                    </Dialog>
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
  archive: PropTypes.func.isRequired,
  startMatch: PropTypes.func.isRequired,
  users: PropTypes.shape({}),
};

App.defaultProps = {
  users: {},
};
