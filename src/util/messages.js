import { getNumberOrFace, getSuit } from './deck';

export const getMessage = (game, { currentUser, opponent } = {}) => {
  const message = {
    text: 'Error: Could not find message for game state',
    action: '',
    actionText: '',
  };
  switch (game.stage) {
    case 0: { // Stage 0: Cutting for the first crib
      const { hasCutForFirstCrib, shownCuts, winner } = game.cutsForFirstCrib;
      const waitingForOtherCutForFirstCrib = hasCutForFirstCrib && shownCuts.length === 1;
      const wonFirstCrib = winner === currentUser;
      const lostFirstCrib = winner === opponent;
      if (!hasCutForFirstCrib) {
        message.text = 'Cut for the first crib';
      } else if (waitingForOtherCutForFirstCrib) {
        message.text = `Waiting for ${opponent} to cut for first crib`;
      } else if (wonFirstCrib) {
        message.text = 'You won the first crib! Deal the first hand';
        message.action = 'deal';
        message.actionText = 'Deal!';
      } else if (lostFirstCrib) {
        message.text = `${opponent} won the first crib. Wait for them to deal`;
      }
      break;
    }
    case 1: { // Stage 1: Discarding cards to the crib
      if (!game.hand.hasDiscarded) {
        message.text = `Select two cards to put in ${game.crib.isMyCrib ? 'your' : 'their'} crib`;
        message.action = 'discard';
        message.actionText = 'Discard';
      } else if (game.hand.hasDiscarded && !game.crib.hasAllCards) {
        message.text = `Waiting for ${opponent} to discard`;
      }
      break;
    }
    case 2: { // stage 2: cut 5th card
      console.log('>>> game: ', game);
      if (!game.cut) {
        if (game.crib.isMyCrib) {
          message.text = 'Cut the fifth card';
        } else {
          message.text = `Waiting for ${opponent} to flip the fifth card`;
        }
      } else {
        message.text = `${game.crib.isMyCrib ? 'You' : 'They'} cut a ${getNumberOrFace(game.cut)} of ${getSuit(game.cut)}!`;
        message.action = 'continueToPegging';
        message.actionText = 'Continue';
      }
      break;
    }
    case 3: { // Stage 3: Pegging
      const {
        playedCards, hasAGo, canPlay, opponentHasAGo, total,
      } = game.pegging;
      const { pairs, runs, fifteens } = game.points.pegging;

      let theirPoints;
      let myPoints;
      try {
        myPoints = pairs.points + fifteens.points + runs.points;

        { /* eslint-disable no-shadow */
          const { pairs, runs, fifteens } = game.opponentPoints.pegging;
          theirPoints = pairs.points + fifteens.points + runs.points;
        } /* eslint-enable no-shadow */
      } catch (e) {
        throw e;
      }
      if (myPoints > 0) {
        message.text = `You got ${myPoints} points! Waiting for ${opponent} to play`;
      } else if (theirPoints > 0) {
        message.text = `They got ${theirPoints} points. Pick a card to play`;
      } else if (playedCards.length === 0) {
        if (canPlay) {
          message.text = 'Your lead, click a card to begin pegging.';
        } else {
          message.text = `Waiting for ${opponent} to begin pegging.`;
        }
        break;
      } else if (opponentHasAGo) {
        message.text = `${opponent} gets a go`;
      } else if (hasAGo) {
        const hit31 = total === 31;
        const pointsToTake = hit31 ? '2 points' : '1 point';
        message.text = `You have a go ${hit31 ? ' and hit 31,' : ','} take ${pointsToTake}.`;
        message.action = 'takeAGo';
        message.actionText = 'OK';
      } else if (canPlay) {
        message.text = 'Pick a card to play.';
      } else {
        message.text = `Waiting for ${opponent} to play.`;
      }
      if (!hasAGo && !opponentHasAGo) message.text += ` (Total = ${total})`;
      break;
    }
    case 4: { // stage 4: count the hand
      const points = game.points.hand.total;
      message.text = `Count your hand, take ${points} points`;
      message.action = 'countHand';
      message.actionText = 'OK';
      break;
    }
    default: {
      message.text = 'not sure whats happening?';
      break;
    }
  }
  return message;
};

export const getActionText = () => 'Deal!';
