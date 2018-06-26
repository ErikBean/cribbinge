import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

// import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Hand from '../Hand';
import Card from '../Card';
import Board from '../board';

export default class CountHands extends PureComponent {
  render() {
    const { userid, opponent } = this.props;
    return (
      <Query
        pollInterval={500}
        query={gql`
        {
          game @client {
            cut
            hand(userid: "${userid}"){
              cards
            }
            opponentHand: hand(userid: "${opponent}"){
              cards
            }
            points(userid: "${userid}", opponentid: "${opponent}"){
              hand
              pegs
            }
            opponentPoints: points(userid: "${opponent}", opponentid: "${userid}"){
              hand
              pegs
            }
          }
        }
      `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :( {error.message}</p>;
          if (!data.game) return <p>No game data</p>;
          return (
            <React.Fragment>
              <Grid container spacing={16} style={{ padding: '20px' }}>
                <Grid item xs={12}>
                  <Hand
                    cards={data.game.opponentHand.cards}
                    disabled
                  />
                </Grid>
              </Grid>
              <Grid container spacing={16} style={{ padding: '20px' }}>
                <Grid item xs={10}>
                  <Board
                    pegs={data.game.points.pegs}
                    opponentPegs={data.game.opponentPoints.pegs}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Card card={data.game.cut} style={{ position: 'absolute', top: '50%' }} />
                </Grid>
              </Grid>
              <Grid container spacing={16} style={{ padding: '20px' }}>
                <Grid item xs={12}>
                  <Hand
                    cards={data.game.hand.cards}
                    disabled
                  />
                </Grid>
              </Grid>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

CountHands.propTypes = {
  userid: PropTypes.string.isRequired,
  opponent: PropTypes.string.isRequired,
};
