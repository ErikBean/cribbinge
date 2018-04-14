import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import a11yClick from './util/a11y';

export default function User({ name, userClicked }) {
  const userStyle = {
    textDecoration: 'underline',
    cursor: 'pointer',
    color: 'blue',
  };
  return (
    <li
      key={name}
      hidden={name === firebase.auth().currentUser.email.split('@')[0]}
      style={userStyle}
    >
      <div
        tabIndex={0}
        role="button"
        onClick={a11yClick(userClicked)}
        onKeyPress={a11yClick(userClicked)}
      >
        {name}
      </div>
    </li>
  );
}
User.propTypes = {
  name: PropTypes.string.isRequired,
  userClicked: PropTypes.func.isRequired,
};
