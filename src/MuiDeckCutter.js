import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Slide from 'material-ui/transitions/Slide';

import Card from './Card';

const styles = theme => ({
  wrapper: {
    position: 'relative',
    height: '100vh',
  },
  root: theme.mixins.gutters({
    marginTop: theme.spacing.unit * 3,
    position: 'absolute',
    paddingTop: 16,
    paddingBottom: 16,
    display: 'inline-block',
    borderRadius: 5,
    transition: '0.5s',
    width: '100px',
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
  cut: {
    color: 'red',
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
  render() {
    const { cutIndex } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.wrapper}>
        <input onChange={this.sliceDeck} defaultValue={cutIndex} type="range" min="0" max="51" style={{ width: '100%' }} />
        {this.props.deck.map((card, i) => {
          const leftRightClass = i > cutIndex ? classes.left : classes.right;
          const cutClass = i === cutIndex ? classes.cut : '';
          const zIndex = i > cutIndex  ? (52 - i) : 'initial';
          return (
            <div id="cardWrapper">
              <Paper
                style={{ marginLeft: `${i * 2}px`, zIndex }}
                key={card}
                className={`${classes.root} ${leftRightClass} ${cutClass}`}
                elevation={4}
              >
              </Paper>
              {i === cutIndex &&
                <Paper 
                  hidden
                >
                  {card}
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
