import React from 'react';
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


function Users({
  users, userClicked, classes,
}) {
  return (
    <Dialog open>
      <DialogTitle id="simple-dialog-title">Select an Opponent</DialogTitle>
      <div className={classes.root}>
        <List>
          {
            Object.keys(users)
            .filter(name => name !== this.props.currentUser)
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

Users.propTypes = {
  users: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({}).isRequired,
  userClicked: PropTypes.func.isRequired,
};

export default withStyles(styles)(Users);
