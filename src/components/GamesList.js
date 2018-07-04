import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import Avatar from '@material-ui/core/Avatar';
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
  },
  nonactive: {
    color: theme.palette.text.secondary,
  },
});


class GamesList extends PureComponent {
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
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                      <ListItemText
                        primary={game.id}
                        secondary="Jan 9, 2014"
                        classes={
                            game.id === activeGame
                              ? { primary: classes.active }
                              : { primary: classes.nonactive }
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
            </List>
          );
        }}
      </Query>
    );
  }
}

GamesList.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  setActiveGame: PropTypes.func.isRequired,
  activeGame: PropTypes.string,
  currentUser: PropTypes.string.isRequired,
};
GamesList.defaultProps = {
  activeGame: '',
};

export default withStyles(styles)(GamesList);
