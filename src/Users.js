import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Dialog, { DialogTitle } from 'material-ui/Dialog';

import Avatar from 'material-ui/Avatar';

import Person from '@material-ui/icons/Person';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});


class Users extends PureComponent {
  state = {
    open: true,
  }
  handleClose = () => {
    this.setState({
      open: false,
    });
  }
  render() {
    const {
      users, userClicked, classes, currentUser,
    } = this.props;
    return (
      <Dialog onClose={this.handleClose} open={this.state.open}>
        <DialogTitle id="simple-dialog-title">Select an Opponent</DialogTitle>
        <div className={classes.root}>
          <List>
            {
              Object.keys(users)
              .filter(name => name !== currentUser)
              .map(name => (
                <ListItem
                  key={name}
                  button
                  onClick={() => userClicked(name)}
                >
                  <Avatar>
                    <Person />
                  </Avatar>
                  <ListItemText primary={name} secondary="" />
                </ListItem>
              ))
            }
          </List>
        </div>
      </Dialog>
    );
  }
}

Users.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  currentUser: PropTypes.string.isRequired,
  userClicked: PropTypes.func.isRequired,
  users: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Users);
