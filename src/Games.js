import React from 'react';
import PropTypes from 'prop-types';

import Game from './Game';

function shouldSelectOpponent(currentUser, games = {}) {
  if (games === null) return true;
  return !Object.keys(games).some(gameId => gameId.indexOf(currentUser !== -1));
}

export default function Games({ users, games, currentUser }) {
  const Users = users;
  const playing = games && Object.keys(games).filter(gameId => gameId.indexOf(currentUser !== -1))
    .reduce((acc, curr) => {
      acc[curr] = games[curr];
      return acc;
    }, {});
  return (
    <div>
      {shouldSelectOpponent(currentUser, games) && <Users />}
      {playing && 
        Object.keys(playing).map(key => (
          <Game key={key} gameId={key} currentUser={currentUser} />
        ))
      }
    </div>
  );
}

Games.propTypes = {
  users: PropTypes.func.isRequired,
  games: PropTypes.shape({}).isRequired,
  currentUser: PropTypes.string.isRequired,
};
