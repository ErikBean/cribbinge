import React from 'react'
function _shouldSelectOpponent(currentUser, games={}){
  if(games === null) return true;
  return !Object.keys(games).some((gameId) => {
    return gameId.indexOf(currentUser !== -1);
  })
}
export default function Games ({users, games, currentUser}) {
  const Users = users;
  const shouldSelectOpponent = _shouldSelectOpponent(currentUser, games)
  console.log('>>> shouldSelectOpponent: ', shouldSelectOpponent);
  // const hasNoGames = Object.keys(games||{}).filter()
  return (
    <div>
      {shouldSelectOpponent && <Users/>}
      {JSON.stringify(games)}
    </div>
  );
}
