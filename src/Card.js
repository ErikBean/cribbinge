import React from 'react'
import { getNumberOrFace, getSuit } from './util/deck'

const Card = (props) => {
  if (!props.card) return (<span>???</span>)
  const value = getNumberOrFace(props.card)
  const suit = getSuit(props.card);
  const bgSrc = props.faceDown ? 'url(./src/svg-cards/card_back.svg)' : `url(./src/svg-cards/${value}_of_${suit}.svg)`
  const style = {
    height: '200px',
    width: '140px',
    background: `${bgSrc} no-repeat`,
    backgroundSize: 'contain'
  }

  return (
    <div style={style} onClick={props.onClick} data-qa={`card-${props.card}`}>
      {props.children}
    </div>
  )
}
export default Card
