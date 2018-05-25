import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import Card from './Card';

const styles = theme => ({
  flipContainer: {
    perspective: '1000px',
    height: '100%',
  },
  flipper: {
    transition: '6s',
    transformStyle: 'preserve-3d',
    position: 'relative',
    height: '100%',
  },
  wrapper: {
    position: 'relative',
    height: '50vh',
  },
  cardWrapper: {
    position: 'absolute',
    width: '140px',
    height: '200px',
    transition: '0.5s',
    marginTop: theme.spacing.unit * 3,
  },
  card: theme.mixins.gutters({
    borderRadius: 5,
    height: '100%',
    width: '100%',
    background: 'url(./src/svg-cards/ic_spa_black_24px.svg) no-repeat',
    backgroundPosition: 'center',
    backgroundColor: 'lightblue',
    backgroundSize: 'contain',
  }),
  cardPaper: {
    position: 'absolute',
    top: 0,
    padding: 0,
    height: '100%',
    width: '100%',
    backfaceVisibility: 'hidden',
  },
  left: {
    left: '5vw',
  },
  right: {
    left: '25vw',
  },
  cardBack: {
    zIndex: 2,
    transform: 'rotateY(0deg)',
  },
  cardFront: {
    transform: 'rotateY(180deg)',
    bottom: 0,
  },
});

class MuiDeckCutter extends PureComponent {
  static propTypes = {
    deck: PropTypes.arrayOf(PropTypes.string).isRequired,
    doCut: PropTypes.func.isRequired,
    hasDoneCut: PropTypes.bool.isRequired,
    shownCuts: PropTypes.arrayOf(PropTypes.string),
    classes: PropTypes.shape({}).isRequired,
  }
  static defaultProps = {
    shownCuts: [],
  }
  state = {
    cutIndex: 25,
  }
  sliceDeck = (e) => {
    this.setState({ cutIndex: parseInt(e.target.value, 10) });
  }
  flipCard = (card) => {
    const index = this.props.deck.indexOf(card);
    const leftStackClicked = index === this.state.cutIndex - 1;
    if (leftStackClicked && !this.props.hasDoneCut) {
      this.props.doCut(card);
    }
  }
  render() {
    const { cutIndex } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.wrapper}>
        <input
          onChange={this.sliceDeck}
          defaultValue={cutIndex}
          type="range"
          min="1"
          max="51"
          style={{ width: '100%' }}
          ref={(elem) => { this.input = elem; }}
          disabled={this.props.hasDoneCut}
        />
        {this.props.deck.map((card, i) => {
          const leftRightClass = i < cutIndex ? classes.left : classes.right;
          const marginLeft = `${i}px`;
          const shown = this.props.shownCuts.indexOf(card) !== -1;
          const flipClass = shown ? classes.cardFront : '';
          return (
            <div
              id="cardWrapper"
              className={`${classes.cardWrapper} ${leftRightClass}`}
              style={{ marginLeft }}
              key={card}
            >
              <div className={classes.flipContainer}>
                <div className={`${classes.flipper} ${flipClass}`}>
                  <Paper
                    elevation={4}
                    className={`${classes.cardPaper} ${classes.cardBack}`}
                    style={{ transform: 'rotateY(0deg)', zIndex: 2 }}
                  >
                    <Button
                      disabled={i !== (cutIndex - 1)}
                      className={`${classes.card}`}
                      onClick={() => this.flipCard(card)}
                    >
                      &nbsp;
                    </Button>
                  </Paper>
                  <Paper
                    elevation={4}
                    className={`${classes.cardPaper} ${classes.cardFront}`}
                  >
                    <Card card={card} className={classes.card} />
                  </Paper>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default withStyles(styles)(MuiDeckCutter);
