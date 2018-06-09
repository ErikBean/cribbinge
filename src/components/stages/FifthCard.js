import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MuiDeckCutter from './beginGame/MuiDeckCutter';

export default class FifthCard extends PureComponent {
  render() {
    return (
      <MuiDeckCutter
        deck={this.props.deck}
        doCut={this.props.flipFifthCard}
        canFlip={this.props.canFlip}
        shownCuts={[this.props.cut]}
        disabled
      />
    );
  }
}

FifthCard.propTypes = {
  deck: PropTypes.arrayOf(PropTypes.string).isRequired,
  flipFifthCard: PropTypes.func.isRequired,
  canFlip: PropTypes.bool.isRequired,
  cut: PropTypes.string.isRequired,
};
