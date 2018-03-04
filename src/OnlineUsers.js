import React from 'react'
import { connect } from 'react-firebase'

function OnlineUsers ({users=[]}) {
  console.log('>>> Here: ', users);
  return (
    <div>
      <ul>
        {
          users.map((user) => {
            return (
              <li key={user}>
                {user}
              </li>
            )
          })
        }
      </ul>
    </div>
  );
}

export default connect((props, ref) => ({
  users: 'onlineUsers',
  addUser: value => ref('onlineUsers').set(value)
}))(OnlineUsers)
