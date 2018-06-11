import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import PegIcon from '@material-ui/icons/DirectionsRun';

import Street from './Street';

const circle = {
  height: '3px',
  width: '3px',
  borderRadius: '99px',
};
const styles = theme => ({
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
        <Street pegs={pegs} />
        <Street pegs={opponentPegs} />
      </div>
      <span />
    </div>
  );
}

export default withStyles(styles)(Board);
