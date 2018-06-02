import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import MuiDeckCutter from './MuiDeckCutter';
import BeginGameCuts from './BeginGameCuts';

export default function BeginGame(props) {
  return (
    <React.Fragment>
      <Grid item sm={12} lg={6}>
        <MuiDeckCutter
          deck={props.deck}
          doCut={props.cutForFirstCrib}
          shownCuts={props.cutsForFirstCrib.shownCuts}
          hasDoneCut={props.cutsForFirstCrib.hasCutForFirstCrib}
        />
      </Grid>
      <Grid item sm={12} lg={6}>
        <BeginGameCuts cuts={props.cutsForFirstCrib.shownCuts} />
      </Grid>
    </React.Fragment>
  );
}

BeginGame.propTypes = {
  deck: PropTypes.arrayOf(PropTypes.string).isRequired,
  cutForFirstCrib: PropTypes.func.isRequired,
  cutsForFirstCrib: PropTypes.shape({
    shownCuts: PropTypes.arrayOf(PropTypes.string).isRequired,
    hasCutForFirstCrib: PropTypes.bool.isRequired,
  }).isRequired,
};
