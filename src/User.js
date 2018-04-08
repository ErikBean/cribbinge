import React from 'react'

export default function User ({name, userClicked}) {
  const userStyle = {
    textDecoration: 'underline',
    cursor: 'pointer',
    color: 'blue',
  }
  return (
    <li 
      key={name}
      hidden={name === firebase.auth().currentUser.email.split('@')[0]}
      style={userStyle}
      onClick={userClicked}
    >
      {name}
    </li>
  );
}
