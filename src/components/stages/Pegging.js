import React from 'react'
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Hand from '../Hand';

export default function Pegging (props) {
  return (
    <Grid
      item
      xs={12}
    >
      <Hand
        {...props.hand}
        onCardClick={props.playPegCard}
        numSelectable={1}
      />
    </Grid>
  );
}
