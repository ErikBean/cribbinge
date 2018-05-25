import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  showInfo: {
    position: 'fixed',
    bottom: 0,
    right: '5vw',
    backgroundColor: 'lightgreen',
  },
});

class SimpleSnackbar extends React.Component {
  state = {
    open: false,
  };

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  doAction = () => {
    this.setState({ open: false }, this.props.action);
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button
          className={classes.showInfo}
          onClick={this.handleClick}
        >
          Info Message
        </Button>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.open}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.props.message}</span>}
          action={[
            <Button
              key="undo"
              color="secondary"
              size="small"
              onClick={this.doAction}
              hidden={!this.props.actionText}
              disabled={!this.props.actionText}
            >
              {this.props.actionText}
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

SimpleSnackbar.propTypes = {
  action: PropTypes.func,
  actionText: PropTypes.string,
  classes: PropTypes.shape({}).isRequired,
  message: PropTypes.string.isRequired,
};

SimpleSnackbar.defaultProps = {
  action: () => {},
  actionText: '',
};

export default withStyles(styles)(SimpleSnackbar);
