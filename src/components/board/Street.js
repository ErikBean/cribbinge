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
    height: '50%',
    padding: '0 8px',
  },
  hole: {
    height: '100%',
    paddingTop: '10px',
  },
  frontPeg: {
    position: 'absolute',
    transform: 'translate(-52%, -70%)',
  },
  rearPeg: {
    position: 'absolute',
    transform: 'translate(-43%, -40%)',
    color: 'white',
  },
});

function Street({ classes, pegs }) {
  return (
    <div className={classes.street}>
      {R.range(0, 60).map((i) => {
        const isFrontPeg = i === pegs.front;
        const isRearPeg = i === pegs.rear;
        const showLine = i % 5 === 0 && i > 0;
        return (
          <React.Fragment key={i}>
            <span
              className={classes.hole}
              style={showLine ? { borderLeft: '1px solid black', paddingLeft: '3px' } : {}}
            >
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
              •
            </span>
          </React.Fragment>
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
