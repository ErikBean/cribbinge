import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Slide from 'material-ui/transitions/Slide';

import { getNumberOrFace, getSuit } from './util/deck';
import Card from './Card';

const styles = theme => ({
  wrapper: {
    position: 'relative',
    height: '100vh',
  },
  root: theme.mixins.gutters({
    marginTop: theme.spacing.unit * 3,
    position: 'absolute',
    display: 'inline-block',
    borderRadius: 5,
    transition: '0.5s',
    width: '140px',
    height: '200px',
    background: 'url(./src/svg-cards/ic_spa_black_24px.svg) no-repeat',
    backgroundPosition: 'center',
    backgroundColor: 'lightblue',
    backgroundSize: 'contain',
    transformStyle: 'preserve-3d',
  }),
  left: {
    left: '5vw',
  },
  right: {
    left: '50vw',
  },
});

class MuiDeckCutter extends PureComponent {
  static propTypes = {
    onDeckCut: PropTypes.func.isRequired,
    hasDoneCut: PropTypes.bool.isRequired,
    deck: PropTypes.arrayOf(PropTypes.string).isRequired,
  }
  state = {
    cutIndex: 25,
  }
  sliceDeck = (e) => {
    this.setState({ cutIndex: parseInt(e.target.value) });
  }
  flipCard = (card) => {
    const index = this.props.deck.indexOf(card);
    const leftStackClicked = index === this.state.cutIndex + 1;
    const rightStackClicked = index === this.state.cutIndex;
    if (leftStackClicked || rightStackClicked) {
      console.log('>>> flipped: ', card);
      this.props.onDeckCut(card);
    }
  }
  render() {
    const { cutIndex } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.wrapper}>
        <input disabled={this.props.hasDoneCut} onChange={this.sliceDeck} defaultValue={cutIndex} type="range" min="0" max="51" style={{ width: '100%' }} />
        {this.props.deck.map((card, i) => {
          const leftRightClass = i > cutIndex ? classes.left : classes.right;
          const cutClass = i === cutIndex ? classes.cut : '';
          const zIndex = i > cutIndex ? (52 - i) : 'initial';
          const marginLeft = `${i * 2}px`;
          const shown = (card === (this.props.shownCuts[0] || {}).card || card === (this.props.shownCuts[1] || {}).card);
          return (
            <div id="cardWrapper" onClick={() => this.flipCard(card)} key={card}>
              <Paper
                style={{ marginLeft, zIndex }}
                className={`${classes.root} ${leftRightClass}`}
                elevation={4}
              />
              {shown &&
                <Paper
                  className={`${classes.root} ${leftRightClass}`}
                  style={{
                    marginLeft,
                    padding: 0,
                    zIndex,
                  }}
                >
                  <Card card={card} />
                </Paper>
              }
            </div>
          );
        })}
      </div>
    );
  }
}

export default withStyles(styles)(MuiDeckCutter);
