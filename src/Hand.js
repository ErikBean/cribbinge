import React, {PureComponent} from 'react'
import PropTypes from 'prop-types';
import Card from './Card';

export default class Hand extends PureComponent {
  state = {
    selected: []
  }
  render(){
    return (
      <React.Fragment>
        {this.props.cards.map(card => {
          return (
            <Card key={card} card={card}/>
          )
        })}
      </React.Fragment>
    );
  }
}
