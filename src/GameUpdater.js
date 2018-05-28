import React, {Component} from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-firebase';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

// import { withClientState } from 'apollo-link-state';

// import { Mutation } from 'react-apollo';

class GameUpdater extends Component {
  componentDidUpdate(){
    const {gameEvents, apolloClient} = this.props;
    if(!gameEvents) return;
    
    this.props.mutate({
      variables: {
        gameId: this.props.gameId,
        game: gameEvents,
      }
    })
  }
  render(){
    return null;
  }
}

const TodoApp = connect((props, ref) => ({
  gameEvents: `games/${props.gameId}`,
}))(GameUpdater)

export default graphql(gql`
  mutation UpdateGame {
    updateGame(gameid: $gameid, game: $game) @client {
      status
    }
  }
`)(TodoApp)

