import React from 'react';
import PropTypes from 'prop-types';

import { getNumberOrFace, getSuit } from './util/deck';
import a11yClick from './util/a11y';

const Card = (props) => {
  if (!props.card) return (<span>???</span>);
  const value = getNumberOrFace(props.card);
  const suit = getSuit(props.card);
  const bgSrc = props.faceDown ? './src/svg-cards/card_back.svg' : `./src/svg-cards/${value}_of_${suit}.svg`;
  const style = {
    width: '140px',
    ...props.style,
  };

  return (
    <img
      style={style}
      role="button"
      tabIndex={0}
      src={bgSrc}
      onClick={a11yClick(props.onClick)}
      onKeyPress={a11yClick(props.onClick)}
      data-qa={`card-${props.card}`}
    >
      {props.children}
    </img>
  );
};

Card.propTypes = {
  card: PropTypes.string.isRequired,
  faceDown: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
};
Card.defaultProps = {
  faceDown: false,
  children: null,
  onClick() {},
};

export default Card;
