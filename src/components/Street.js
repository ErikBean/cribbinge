import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import * as R from 'ramda';
import PegIcon from '@material-ui/icons/DirectionsRun';


const circle = {
  height: '3px',
  width: '3px',
  borderRadius: '99px',
};
const styles = theme => ({
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
const oneTwenty = new Array(120);

function Street({ classes, pegs }) {
  return (

    <div className={classes.street}>
      {R.range(0, 119).map((i) => {
            const isPeg = i === pegs.front || i === pegs.rear;
            return (
              <span className={classes.hole} key={i} >
                {isPeg &&
                  <PegIcon className={classes.pegPosition} style={{ fontSize: '42px' }} />
                }
              </span>
            );
          })}
    </div>

  );
}

export default withStyles(styles)(Street);
