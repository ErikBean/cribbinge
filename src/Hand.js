import React, {PureComponent} from 'react'
import PropTypes from 'prop-types';
import Card from './Card';
import { withStyles } from 'material-ui/styles';


const styles = theme => ({
  cardContainer: {
    display: 'inline-block',
    paddingTop: '10px',
  }
})

class Hand extends PureComponent {
  state = {
    selected: []
  }
  selectCard = (card) => {
    if(this.state.selected.indexOf(card) !== -1) return;
    this.setState({
      selected: [
        card,
        this.state.selected[0],
      ]
    })
  }
  render(){
    return (
      <React.Fragment>
        {this.props.cards.map(card => {
          return (
            <div 
              key={card}
              style={{
                position: 'relative',
                top: this.state.selected.indexOf(card) !== -1 ? '-20px': '0'
              }}
              className={this.props.classes.cardContainer}
            >
              <Card card={card} onClick={() => this.selectCard(card)} />
            </div>
          )
        })}
      </React.Fragment>
    );
  }
}
export default withStyles(styles)(Hand)