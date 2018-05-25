import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';

import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';

const styles = (theme) => {
  console.log('>>> theme: ', theme);
  return {
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    gutters: {
      paddingRight: '50px',
      paddingLeft: '50px',
      [theme.breakpoints.between('xs', 'md')]: {
        paddingRight: '20px',
        paddingLeft: '20px',
      },
    },
    active: {
      fontWeight: 'bold',
      color: theme.palette.text.primary,
    },
    nonactive: {
      color: theme.palette.text.secondary,
    },
  };
};


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
          if (!data.games.length) {
            // TODO: Provide a way for user to start a new game from here
            return <p>You have no active games at this time.</p>;
          }
          return (
            <div className={classes.root}>
              <List subheader={<ListSubheader component="div">Games</ListSubheader>}>
                <Divider />
                {data.games
                  .filter(game => game.id.includes(this.props.currentUser))
                  .map(game => (
                    <React.Fragment key={game.id}>
                      <ListItem
                        button
                        onClick={() => this.props.setActiveGame(game.id)}
                        classes={{gutters: classes.gutters}}
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
                      <Divider />
                    </React.Fragment>
                  ))}
              </List>
            </div>
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
};
GamesList.defaultProps = {
  activeGame: '',
};

export default withStyles(styles)(GamesList);
