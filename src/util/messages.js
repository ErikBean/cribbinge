module.exports.getMessage = (game, { currentUser, opponent } = {}) => {
  const message = {
    text: 'Error: Could not find message for game state',
    action: '',
    actionText: '',
  };
  if (game.stage === 0) { // Stage 0: Cutting for the first crib
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
  } else if (game.stage === 1) { // Stage 1: Discarding cards to the crib
    if (!game.hand.hasDiscarded) {
      message.text = `Select two cards to put in ${game.crib.isMyCrib ? 'your' : 'their'} crib`;
      message.action = 'discard';
      message.actionText = 'Discard';
    } else if (game.hand.hasDiscarded && !game.crib.hasAllCards) {
      message.text = `Waiting for ${opponent} to discard`;
    }
  } else if (game.stage === 2) { // Stage 2: Pegging
    const {
      playedCards, hasAGo, canPlay, opponentHasAGo,
    } = game.pegging;
    if (playedCards.length === 0) {
      if (game.crib.isMyCrib) {
        message.text = `Waiting for ${opponent} to begin pegging`;
      } else {
        message.text = 'Your lead, click a card to begin pegging';
      }
    } else if (opponentHasAGo) {
      message.text = `${opponent} gets a go`;
    } else if (hasAGo) {
      message.text = 'You have a go, take 1 point';
      message.action = 'takeAGo';
      message.actionText = 'OK';
    } else if (canPlay) {
      message.text = 'Pick a card to play';
    } else {
      message.text = `Waiting for ${opponent} to play`;
    }
  } else if (game.stage === 3) {
    message.text = 'Count your hand';
    message.action = 'countHand';
    message.actionText = 'OK';
  }
  return message;
};

module.exports.getActionText = () => 'Deal!';
