import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: theme.mixins.gutters({
    position: 'fixed',
    display: 'flex',
    justifyContent: 'space-between',
    bottom: 16,
    left: 16,
    right: 16,
    paddingTop: 16,
    paddingBottom: 16,
  }),
  button: {
    // margin: theme.spacing.unit,
  }
});

function GameControls(props) {
  const { classes, message, actionText, action } = props;
  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="headline" component="h3">
        {message}
      </Typography>
      {actionText && 
        <Button
          variant="raised" color="primary" aria-label="add" size="large"
          onClick={action}
          className={classes.button}
        >
          {actionText}
        </Button>
      }
    </Paper>
  );
}

GameControls.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GameControls);
