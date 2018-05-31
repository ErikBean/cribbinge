import React from 'react';
import PropTypes from 'prop-types';

import { getNumberOrFace, getSuit } from '../util/deck';

const Card = (props) => {
  if (!props.card) return (<span>???</span>);
  const value = getNumberOrFace(props.card);
  const suit = getSuit(props.card);
  const bgSrc = props.faceDown ? './src/svg-cards/card_back.svg' : `./src/svg-cards/${value}_of_${suit}.svg`;
  const style = {
    ...props.style,
  };

  return (
    <img
      style={style}
      src={bgSrc}
      alt={`${value} of ${suit}`}
      data-qa={`card-${props.card}`}
    />
  );
};

Card.propTypes = {
  card: PropTypes.string.isRequired,
  faceDown: PropTypes.bool,
  style: PropTypes.shape({}),
};
Card.defaultProps = {
  faceDown: false,
  style: {},
};

export default Card;
