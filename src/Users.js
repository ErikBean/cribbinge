import React from 'react'
import { connect } from 'react-firebase'
import User from './User';

export default function OnlineUsers ({users}) {
  console.log('>>> Here: ', users);
  return (
    <div>
      <ul>
        {Object.keys(users).map((user) => {
          return (<User user={user}/>)
        })}
        {JSON.stringify(users)}
      </ul>
    </div>
  );
}
