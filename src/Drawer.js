import React from 'react'
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import GamesList from './GamesList';

const styles = (theme) => ({
  title: {
    margin: theme.spacing.unit * 5,
  }
})
function MuiDrawer ({open, toggleDrawer, classes, children}) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer}
    >
      {children}
    </Drawer>
  );
}

export default withStyles(styles)(MuiDrawer)