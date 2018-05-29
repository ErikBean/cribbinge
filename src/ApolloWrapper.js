import React, {PureComponent} from 'react'
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { connect } from 'react-firebase';

import {
  defaults,
  resolvers,
  typeDefs
} from './util/gql';

const client = new ApolloClient({
  // uri: "https://us-central1-crabapple-f6555.cloudfunctions.net/api/graphql", // serve from cloud function
  uri: 'http://localhost:5000/crabapple-f6555/us-central1/api/graphql', // serve locally
  credentials: true,
  clientState: {
    defaults,
    resolvers,
    typeDefs
  },
});
window.ac = client;

class ApolloWrapper extends PureComponent {
  componentDidMount(){
    this.update();
  }
  componentDidUpdate(){
    this.update();
  }
  update(){    
    const {events} = this.props;
    if(events){
      console.log('>>> I updated!: ', events);      
      const data = { gameEvents: Object.values(events) };
      client.writeData({ data });
    }
  }
  render(){
    return (
      <ApolloProvider client={client}>
        <React.Fragment>
          {this.props.children}
        </React.Fragment>
      </ApolloProvider>
    );
  }
}

export default connect((props, ref) => ({
  events: `games/${props.gameId}`
}))(ApolloWrapper);
