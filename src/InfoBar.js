import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

const styles = theme => {
  return ({
    root: theme.mixins.gutters({
      paddingTop: 16,
      paddingBottom: 16,
      marginBottom: theme.spacing.unit * 3,
      backgroundColor: theme.palette.secondary.main,
    }),
  })
};

function InfoBar(props) {
  const { classes } = props;
  return (
    <div>
      <Paper className={classes.root} elevation={2}>
        <Typography variant="headline" component="h3">
          {props.mainMessage}
        </Typography>
        <Typography component="p">
          {props.subMessage}
        </Typography>
      </Paper>
    </div>
  );
}

InfoBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InfoBar);
