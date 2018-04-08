import React from 'react'
import { connect } from 'react-firebase'
import User from './User';

export default function OnlineUsers ({users, userClicked}) {
  return (
    <div>
      Please select an opponent:
      <ul>
        {Object.keys(users).map((name) => {
          return (
            <User 
              key={name} 
              name={name} 
              userClicked={() => userClicked(name)}
            />
          )
        })}
      </ul>
    </div>
  );
}
