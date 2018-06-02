import React from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import PlayedCards from './PlayedCards';
import Hand from '../../Hand';

const styles = (theme) => {
  console.log('>>> theme: ', theme);
  return {
    paper: {
      position: 'relative',
      padding: '50px 20px',
      height: '500px',
      margin: '30px',
      backgroundColor: theme.palette.background.paper,
    },
  };
};

function Pegging({
  hand, playPegCard, classes, userid,
}) {
  return (
    <Query
      pollInterval={500}
      query={gql`
        {
          game @client {
            pegging(userid: "${userid}") {
              playedCards {
                card
                playedBy
              }
              hasAGo
              canPlay
            }
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :( {error.message}</p>;
        if (!data.game) return <p>No game data</p>;
        const { playedCards = [] } = data.game.pegging || {};
        console.log('>>> PeggingInfo: ', data.game.pegging);
        return (
          <React.Fragment>
            <Grid item xs={12}>
              <Paper elevation={5} className={classes.paper}>
                <PlayedCards playedCards={playedCards} currentUser={userid} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Hand
                {...hand}
                onCardClick={playPegCard}
                numSelectable={1}
                disabled={!data.game.pegging.canPlay}
              />
            </Grid>
          </React.Fragment>
        );
      }}

    </Query>
  );
}

export default withStyles(styles)(Pegging);

Pegging.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  hand: PropTypes.shape({}).isRequired,
  userid: PropTypes.string.isRequired,
  playPegCard: PropTypes.func.isRequired,
};
