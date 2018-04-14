import React from 'react';
import PropTypes from 'prop-types';
import User from './User';

export default function OnlineUsers({ users, userClicked }) {
  return (
    <div>
      Please select an opponent:
      <ul>
        {Object.keys(users).map(name => (
          <User
            key={name}
            name={name}
            userClicked={() => userClicked(name)}
          />
        ))}
      </ul>
    </div>
  );
}

OnlineUsers.propTypes = {
  users: PropTypes.shape({}).isRequired,
  userClicked: PropTypes.func.isRequired,
};
