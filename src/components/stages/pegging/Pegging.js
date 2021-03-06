import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { pointValue } from '../../../util/points';
import PlayedCards from './PlayedCards';
import Hand from '../../Hand';
import Board from '../../board';

const styles = (theme) => {
  console.log('>>> theme: ', theme);
  return {
    paper: {
      position: 'relative',
      padding: '50px 20px',
      height: '75vh',
      minHeight: '600px',
      margin: '30px',
      backgroundColor: theme.palette.background.paper,
    },
  };
};

class Pegging extends PureComponent {
  tryPlayCard(total, card) {
    const newTotal = (pointValue(card) + total);
    if (newTotal <= 31) {
      this.props.playPegCard(card);
    } else {
      window.alert('Please choose a lower card');
    }
  }

  render() {
    const {
      hand, classes, opponent, userid,
    } = this.props;
    return (
      <Query
        pollInterval={500}
        query={gql`
        {
          game @client {
            pegging(userid: "${userid}", opponentid: "${opponent}") {
              playedCards {
                card
                playedBy
              }
              hasAGo
              canPlay
              total
              opponentHasAGo(userid: "${userid}")
            }
            points(userid: "${userid}", opponentid: "${opponent}"){
              pegging
              pegs
            }
            opponentPoints: points(userid: "${opponent}", opponentid: "${userid}"){
              pegging
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
          const { playedCards = [] } = data.game.pegging || {};
          const { total, canPlay } = data.game.pegging;
          return (
            <React.Fragment>
              <Grid item xs={12}>
                <Paper elevation={5} className={classes.paper}>
                  <Board
                    pegs={data.game.points.pegs}
                    opponentPegs={data.game.opponentPoints.pegs}
                  />
                  <PlayedCards
                    playedCards={playedCards}
                    currentUser={userid}
                    total={total}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Hand
                  {...hand}
                  onCardClick={([card]) => this.tryPlayCard(total, card)}
                  numSelectable={1}
                  disabled={!canPlay}
                />
              </Grid>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(Pegging);

Pegging.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  hand: PropTypes.shape({}).isRequired,
  userid: PropTypes.string.isRequired,
  opponent: PropTypes.string.isRequired,
  playPegCard: PropTypes.func.isRequired,
};
