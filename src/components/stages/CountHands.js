import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Hand from '../Hand';
import Card from '../Card';
import Board from '../board';

const textStyle = {
  fontSize: '48px',
  position: 'relative',
  top: '80px',
};
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
            stage
            hand(userid: "${userid}"){
              cards
            }
            crib {
              cards
              isMyCrib(userid: "${userid}")
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
          const { isMyCrib, cards: cribCards } = data.game.crib;
          const { cards: myHandCards } = data.game.hand;
          const { cards: theirHandCards } = data.game.opponentHand;
          const isCribCountingStage = data.game.stage === 5;
          const showMyCrib = isMyCrib && isCribCountingStage;
          const showtheirCrib = !isMyCrib && isCribCountingStage;

          const myCards = showMyCrib ? cribCards : myHandCards;
          const theirCards = showtheirCrib ? cribCards : theirHandCards;
          const cribBanner = (
            <Typography style={textStyle}>
              {`${isMyCrib ? 'Your' : 'Their'} Crib`}
            </Typography>
          );
          return (
            <React.Fragment>
              <Grid container style={{ padding: '20px' }}>
                <Grid item xs={12}>
                  {showtheirCrib && cribBanner}
                  <Hand
                    cards={theirCards}
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
              <Grid container style={{ padding: '20px' }}>
                <Grid item xs={12}>
                  {showMyCrib && cribBanner}
                  <Hand
                    cards={myCards}
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
