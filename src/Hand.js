import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from '@material-ui/core/Button';

import Card from './Card';

const styles = theme => ({
  cardContainer: {
    display: 'inline-block',
    position: 'relative',
    overflow: 'visible',
    paddingTop: theme.spacing.unit * 10,
    width: '100px',
  },
  cardButton: {
    padding: 0,
  },
});

class Hand extends PureComponent {
  state = {
    selected: [],
  }
  onCardClick = (card) => {
    const { numSelectable } = this.props;
    const sliceAt = numSelectable > 0 ? numSelectable - 1 : 0;
    console.log('>>> Here: ', sliceAt, numSelectable, this.state.selected);
    return this.setState({
      selected: [
        card,
        ...this.state.selected.slice(0, sliceAt),
      ],
    }, () => this.props.onCardClick(this.state.selected));
  }
  render() {
    const { cards, classes } = this.props;
    const { selected } = this.state;
    return (
      <React.Fragment>
        {cards.map(card => (
          <div
            key={card}
            className={classes.cardContainer}
            style={{
              top: selected.indexOf(card) !== -1 ? '-50px' : '0',
            }}
          >
            <Button
              onClick={() => this.onCardClick(card)}
              className={classes.cardButton}
            >
              <Card card={card} />
            </Button>
          </div>
        ))}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Hand);

Hand.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCardClick: PropTypes.func,
  classes: PropTypes.shape({
    cardContainer: PropTypes.string.isRequired,
  }).isRequired,
  numSelectable: PropTypes.number,
};

Hand.defaultProps = {
  onCardClick() {},
  numSelectable: 0,
};
