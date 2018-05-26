import React from 'react';
import PropTypes from 'prop-types';

import { getNumberOrFace, getSuit } from './util/deck';
import a11yClick from './util/a11y';

const Card = (props) => {
  if (!props.card) return (<span>???</span>);
  const value = getNumberOrFace(props.card);
  const suit = getSuit(props.card);
  const bgSrc = props.faceDown ? 'url(./src/svg-cards/card_back.svg)' : `url(./src/svg-cards/${value}_of_${suit}.svg)`;
  const style = {
    display: 'inline-block',
    height: '200px',
    width: '140px',
    background: `${bgSrc} no-repeat`,
    backgroundSize: 'contain',
  };

  return (
    <div
      style={style}
      role="button"
      tabIndex={0}
      onClick={a11yClick(props.onClick)}
      onKeyPress={a11yClick(props.onClick)}
      data-qa={`card-${props.card}`}
    >
      {props.children}
    </div>
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
