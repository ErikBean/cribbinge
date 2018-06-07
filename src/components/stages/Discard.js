import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Hand from '../Hand';

export default function Discard(props) {
  return (
    <Grid
      item
      xs={12}
      style={{
        paddingTop: '100px',
      }}
    >
      <Hand
        {...props.hand}
        onCardClick={props.onCardClick}
        numSelectable={2}
      />
    </Grid>
  );
}

Discard.propTypes = {
  hand: PropTypes.shape({}).isRequired,
  onCardClick: PropTypes.func.isRequired,
};
