import React, {Component} from 'react'
import { hot } from 'react-hot-loader'
import { connect } from 'react-firebase'

import firebase from 'firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import CounterThing from './CounterThing'
import Card from './Card';
import Users from './Users';
import Games from './Games';

var config = {
  apiKey: "AIzaSyAifgF5ZKTGRN3MJQ2CjWEgcyGJZ3O28Tg",
  authDomain: "crabapple-f6555.firebaseapp.com",
  databaseURL: "https://crabapple-f6555.firebaseio.com",
  projectId: "crabapple-f6555",
  storageBucket: "crabapple-f6555.appspot.com",
  messagingSenderId: "801912982668"
};

firebase.initializeApp(config);
window.firebase = firebase;
export default class App extends Component {
  
  // The component's Local state.
  state = {
    signedIn: false, // Local signed-in state.
    name: '' // current user's email before the @ sign
  };

  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccess: () => console.log('signed in!')
    }
  };
  onAuthStateChanged = (user) => {
    this.setState({
      signedIn: !!user,
      name: user && user.email.split('@')[0]
    })
    if(user){
      this.props.addUser(user.email.split('@')[0])
    }
  }
  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }
  startMatch = (withUser) => {
    const gameId = `${this.state.name}-${withUser}`;
    this.props.startMatch(gameId);
  }
  render() {
    if (!this.state.signedIn) {
      return (
        <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
      );
    }
    const {currentUser: {email}, signOut} = firebase.auth();
    const halfWidth = {
      width: '50%',
      display: 'inline-block'
    }
    return (
      <div>
        <h1 style={halfWidth}>CribbagePatch v2.2.3</h1>
        <a style={halfWidth} href="/" onClick={() => firebase.auth().signOut()}>Sign-out</a>
        <p>Welcome {this.state.name}!</p>
        <Games 
          games={this.props.games}
          users={() => <Users users={this.props.users || {}} userClicked={this.startMatch}/>}
          currentUser={this.state.name}
        />
        <CounterThing />
      </div>
    );
  }
}