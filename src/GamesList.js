import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader'
import Divider from '@material-ui/core/Divider';

import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});


class GamesList extends PureComponent {

 
 render(){
   const { classes } = this.props;
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
         if(!data.games.length) {
           // TODO: Provide a way for user to start a new game from here 
           return <p>You have no active games at this time.</p>
         }
         return (
           <div className={classes.root}>
             <List subheader={<ListSubheader component="div">Games</ListSubheader>}>
               {data.games.map(game => {
                 return (
                   <React.Fragment key={game.id}>
                     <ListItem 
                       button
                       onClick={() => this.props.setActiveGame(game.id)}
                     >

                       <Avatar>
                         <PersonIcon />
                       </Avatar>
                       <ListItemText primary={game.id} secondary="Jan 9, 2014" />
                     </ListItem>
                     <Divider />
                   </React.Fragment>
                 )
               })}
             </List>
           </div>
         )
       }}
     </Query>
   );
 }
}

GamesList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GamesList);