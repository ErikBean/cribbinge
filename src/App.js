import React, {Component} from 'react'
import { hot } from 'react-hot-loader'
import { connect } from 'react-firebase'

import firebase from 'firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import CounterThing from './CounterThing'
import Card from './Card';
import Users from './Users';

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
class App extends Component {
  
  // The component's Local state.
  state = {
    signedIn: false // Local signed-in state.
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
    this.setState({signedIn: !!user})
    if(user){
      this.addUser(user)
    }
  }
  
  addUser = (user) => {
    this.props.addUser(user.email)
  }
  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  render() {
    if (!this.state.signedIn) {
      return (
        <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
      );
    }
    const {currentUser: {email}, signOut} = firebase.auth();
    return (
      <div>
        <h1>My App</h1>
        <p>Welcome {email}! Please select an opponent:</p>
        <Users users={this.props.users || {}}/>
        Events: {JSON.stringify(this.props.events)}
        <CounterThing />
        <Card card="H13"/>
        <a href="/" onClick={() => firebase.auth().signOut()}>Sign-out</a>
      </div>
    );
  }
}
const ConnectedApp = connect((props, ref) => ({
  users: 'users',
  addUser: value => ref(`users/${value.split('@')[0]}/online`).set('true'),
  removeUser: value => ref(`users/${value.split('@')[0]}`).set('offline'),
}))(App)

export default hot(module)(ConnectedApp);