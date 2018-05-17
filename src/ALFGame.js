import React, {PureComponent} from 'react'
import PropTypes from 'prop-types';
import firebase from 'firebase';

export default class Game extends PureComponent {
  render(){
    return (
      <div>Game on: {JSON.stringify(this.props, null, 2)}</div>
    );
  }
}
