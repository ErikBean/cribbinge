import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import * as R from 'ramda';

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
    height: '3px',
    width: '3px',
    borderRadius: '99px',
    backgroundColor: '#111',
  },
});
const oneTwenty = new Array(120);

function Board({ classes }) {
  return (
    <div className={classes.vertFlex}>
      <span />
      <div className={classes.board}>
        <div className={classes.street}>
          {R.range(0, 119).map(i => (
            <span className={classes.hole} key={i} />
            ))}
        </div>
        <div className={classes.street}>
          {R.range(0, 119).map(i => (
            <span className={classes.hole} key={i} />
            ))}
        </div>
      </div>
      <span />
    </div>
  );
}

export default withStyles(styles)(Board);
