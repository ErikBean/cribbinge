import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Person from '@material-ui/icons/Person';

const styles = theme => ({
  li: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    padding: '20px !important',
  },
});


class Users extends PureComponent {
  render() {
    const {
      users, userClicked, classes, currentUser,
    } = this.props;
    return (
      <List subheader={<ListSubheader component="div">Users</ListSubheader>}>
        {
          Object.keys(users)
          .filter(name => name !== currentUser)
          .map(name => (
            <ListItem
              key={name}
              button
              onClick={() => userClicked(name)}
              className={classes.li}
            >
              <Avatar>
                <Person />
              </Avatar>
              <ListItemText primary={name} secondary="" />
            </ListItem>
          ))
        }
      </List>
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
