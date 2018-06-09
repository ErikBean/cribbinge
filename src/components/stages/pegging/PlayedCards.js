import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

import { withStyles } from '@material-ui/core/styles';

import Card from '../../Card';

const styles = theme => ({
  cardContainer: {
    position: 'absolute',
    display: 'inline-block',
    width: '80px',
    overflowX: 'visible',
  },
  total: {
    position: 'absolute',
    width: '110px',
    textAlign: 'center',
    margin: '55px 20px',
    borderRadius: '99px',
    fontSize: 72,
    color: theme.palette.primary.light,
    border: `3px solid ${theme.palette.primary.light}`,
  },
});

function PlayedCards({
  playedCards, classes, currentUser, total,
}) {
  return playedCards.map(({ card, playedBy }, idx) => {
    const offsetDirection = playedBy === currentUser ? 'bottom' : 'top';
    const isLastPlayed = idx === playedCards.length - 1;
    return (
      <div
        key={card}
        className={classes.cardContainer}
        style={{
          left: `${idx * 50}px`,
          [offsetDirection]: 0,
        }}
      >
        {isLastPlayed
          ? (
            <Typography className={classes.total}>
              {total}{total === 15 || total === 31 ? '!' : ''}
            </Typography>
          ) : null
        }
        <Card card={card} style={{ width: '150px' }} />
      </div>
    );
  });
}

export default withStyles(styles)(PlayedCards);

PlayedCards.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  currentUser: PropTypes.string.isRequired,
  playedCards: PropTypes.arrayOf(PropTypes.shape({
    card: PropTypes.string.isRequired,
    playedBy: PropTypes.string.isRequired,
  })).isRequired,
};
