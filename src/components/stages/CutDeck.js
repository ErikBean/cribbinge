import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MuiDeckCutter from './beginGame/MuiDeckCutter';

export default class CutDeck extends PureComponent {
  render() {
    return (
      <MuiDeckCutter
        deck={this.props.deck}
        doCut={this.props.flipFifthCard}
        changeCutIndex={this.props.changeCutIndex}
      />
    );
  }
}

CutDeck.propTypes = {
  deck: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeCutIndex: PropTypes.func.isRequired,
  flipFifthCard: PropTypes.func.isRequired,
};
