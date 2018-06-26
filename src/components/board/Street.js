import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import * as R from 'ramda';
import FrontPegIcon from '@material-ui/icons/DirectionsRun';
import RearPegIcon from '@material-ui/icons/ArrowDropDown';

const styles = () => ({
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
  frontPeg: {
    position: 'absolute',
    transform: 'translate(-56%, -90%)',
  },
  rearPeg: {
    position: 'absolute',
    transform: 'translate(-46%, -62%)',
    color: 'white',
  },
});

function Street({ classes, pegs }) {
  return (
    <div className={classes.street}>
      {R.range(0, 59).map((i) => {
        const isFrontPeg = i === pegs.front;
        const isRearPeg = i === pegs.rear;
        return (
          <span className={classes.hole} key={i} >
            {isFrontPeg &&
              <FrontPegIcon
                className={classes.frontPeg}
                style={{ fontSize: '42px' }}
              />
            }
            {isRearPeg &&
              <RearPegIcon
                className={classes.rearPeg}
                style={{ fontSize: '42px' }}
              />
            }
          </span>
        );
      })}
    </div>
  );
}

Street.propTypes = {
  pegs: PropTypes.shape({
    front: PropTypes.number,
    rear: PropTypes.number,
  }).isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Street);
