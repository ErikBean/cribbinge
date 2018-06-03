import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Card from '../../Card';

const styles = (/* theme */) => ({
  cardContainer: {
    position: 'absolute',
    display: 'inline-block',
    width: '80px',
    overflowX: 'visible',
  },
});

function PlayedCards({ playedCards, classes, currentUser }) {
  return playedCards.map(({ card, playedBy }, idx) => {
    const offsetDirection = playedBy === currentUser ? 'bottom' : 'top';
    return (
      <div
        key={card}
        className={classes.cardContainer}
        style={{
          left: `${idx * 50}px`,
          [offsetDirection]: 0,
        }}
      >
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
