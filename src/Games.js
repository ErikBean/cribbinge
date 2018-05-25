import React from 'react';
import PropTypes from 'prop-types';

import Game from './Game';

export default function Games({ games, currentUser }) {
  const playing = games && Object.keys(games).filter(gameId => gameId.indexOf(currentUser !== -1))
    .reduce((acc, curr) => {
      acc[curr] = games[curr];
      return acc;
    }, {});
  return (
    <React.Fragment>
      {playing &&
        Object.keys(playing).map(key => (
          <Game
            key={key}
            gameId={key}
            currentUser={currentUser}
            opponent={key.replace(currentUser, '').replace('-', '')}
          />
        ))
      }
    </React.Fragment>
  );
}

Games.propTypes = {
  games: PropTypes.shape({}).isRequired,
  currentUser: PropTypes.string.isRequired,
};
