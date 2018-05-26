import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { getMessage } from './util/messages';
import Game from './Game';
import GameControls from './GameControls';

export default class GameQuery extends PureComponent {
  render() {
    const { currentUser, gameId } = this.props;
    const opponent = gameId.replace(this.props.currentUser, '').replace('-', '');
    return (
      <Query
        pollInterval={10000}
        query={gql`
      {
        game(id: "${gameId}") {
          deck
          stage
          cutsForFirstCrib {
            hasCutForFirstCrib(userid: "${currentUser}")
            shownCuts
            winner
          }
          hand(userid: "${currentUser}")
        }
      }
    `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :( {error.message}</p>;
          const message = getMessage(data.game, { currentUser, opponent });
          return (
            <Game
              gameId={gameId}
              currentUser={currentUser}
              opponent={opponent}
              controls={actions => (
                <GameControls
                  message={message.text}
                  actionText={message.actionText}
                  action={actions[message.action]}
                />
              )}
              {...data.game}
            />
          );
        }}
      </Query>
    );
  }
}

GameQuery.propTypes = {
  gameId: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};
