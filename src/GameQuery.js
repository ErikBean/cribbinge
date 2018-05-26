import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Grid from '@material-ui/core/Grid';
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
        }
      }
    `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :( {error.message}</p>;
          const message = getMessage(data.game, { currentUser, opponent });
          return (
            <Grid container>
              <Grid item sm={12}>
                <Game
                  gameId={gameId}
                  currentUser={currentUser}
                  opponent={opponent}
                  {...data.game}
                />
              </Grid>
              <Grid item sm={12}>
                <GameControls
                  message={message.text}
                  actionText={message.actionText}
                  action={this[message.action]}
                />
              </Grid>
            </Grid>
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
