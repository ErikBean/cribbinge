import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';

import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonIcon from '@material-ui/icons/Person';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  active: {
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    padding: '0 15px',
  },
  nonactive: {
    color: theme.palette.text.secondary,
    padding: '0 15px',
  },
});


class GamesList extends PureComponent {
  state = {
    showRemoveConfirm: false,
    gameToRemove: null,
  }
  setGameToDelete = (gameId) => {
    this.setState({ showRemoveConfirm: true, gameToRemove: gameId });
  }
  handleDialogClose = () => this.setState({ showRemoveConfirm: false })
  removeGame = () => {
    this.setState({ showRemoveConfirm: false })
    this.props.clearActiveGame(this.state.gameToRemove);
  }
  render() {
    const { classes, activeGame } = this.props;
    return (
      <Query
        query={gql`
         {
           games {
             id
           }
         }
       `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :( {error.message}</p>;

          return (
            <React.Fragment>
              <Dialog
                open={this.state.showRemoveConfirm}
                onClose={this.handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  Are you sure you want to delete {activeGame.replace('-', ' vs ')}?
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    This action is permanent. There is no way to restore a deleted game.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleDialogClose} color="primary">
                    Nevermind
                  </Button>
                  <Button onClick={this.removeGame} color="secondary" autoFocus>
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
              <List className={classes.root} subheader={<ListSubheader component="div">Games</ListSubheader>}>
                {!data.games.length &&
                  <ListItem>
                    <ListItemText primary="You currently have no active games" />
                  </ListItem>
                }
                {data.games
                  .filter(game => game.id.includes(this.props.currentUser))
                  .map(game => (
                    <React.Fragment key={game.id}>
                      <ListItem
                        button
                        onClick={() => this.props.setActiveGame(game.id)}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={game.id.replace('-', ' vs ')}
                          secondary="Jan 9, 2014"
                          classes={
                            game.id === activeGame
                              ? { primary: classes.active }
                              : { primary: classes.nonactive }
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton aria-label="Delete" onClick={() => this.setGameToDelete(game.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </React.Fragment>
                  ))}
              </List>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

GamesList.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  setActiveGame: PropTypes.func.isRequired,
  clearActiveGame: PropTypes.func.isRequired,
  activeGame: PropTypes.string,
  currentUser: PropTypes.string.isRequired,
};
GamesList.defaultProps = {
  activeGame: '',
};

export default withStyles(styles)(GamesList);
