import React from 'react'
import Game from './Game';

function _shouldSelectOpponent(currentUser, games={}){
  if(games === null) return true;
  return !Object.keys(games).some((gameId) => {
    return gameId.indexOf(currentUser !== -1);
  })
}
export default function Games ({users, games, currentUser}) {
  const Users = users;
  const shouldSelectOpponent = _shouldSelectOpponent(currentUser, games)
  const playing = games && Object.keys(games).filter((gameId) => gameId.indexOf(currentUser !== -1))
  .reduce((acc, curr) => {
    acc[curr] = games[curr];
    return acc;
  }, {});
  return (
    <div>
      {shouldSelectOpponent && <Users/>}
      {playing && Object.keys(playing).map((key) =>{
        return (
          <Game key={key} gameId={key} gameEvents={playing[key]} currentUser={currentUser}/>
        );
      })}
    </div>
  );
}
