import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Street from './Street';

const circle = {
  height: '3px',
  width: '3px',
  borderRadius: '99px',
};
const styles = () => ({
  vertFlex: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  board: {
    backgroundColor: 'brown',
    height: '80px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  street: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '18px 8px',
  },
  hole: {
    ...circle,
    backgroundColor: '#111',
  },
  pegPosition: {
    position: 'absolute',
    transform: 'translate(-56%, -90%)',
  },
});

function Board({ classes, pegs, opponentPegs }) {
  return (
    <div className={classes.vertFlex}>
      <span />
      <div className={classes.board}>
        <Street pegs={opponentPegs} />
        <Street pegs={pegs} />
      </div>
      <span />
    </div>
  );
}

Board.propTypes = {
  pegs: PropTypes.shape({
    front: PropTypes.number,
    rear: PropTypes.number,
  }).isRequired,
  opponentPegs: PropTypes.shape({
    front: PropTypes.number,
    rear: PropTypes.number,
  }).isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Board);
