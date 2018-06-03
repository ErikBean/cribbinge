import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function ButtonAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={props.onMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className={classes.flex}>
            CribbagePatch
          </Typography>
          <Button color="inherit" onClick={() => firebase.auth().signOut()}>Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
ButtonAppBar.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  onMenuClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(ButtonAppBar);