module.exports.getMessage = (game, { currentUser, opponent } = {}) => {
  const message = {
    text: 'Error: Could not find message for game state',
    action: '',
    actionText: '',
  };
  // TODO: Move the below to graphql:
  const { hasCutForFirstCrib, shownCuts, winner } = game.cutsForFirstCrib;
  const waitingForOtherCutForFirstCrib = hasCutForFirstCrib && shownCuts.length === 1;
  const wonFirstCrib = winner === currentUser;
  const lostFirstCrib = winner === opponent;

  if (game.stage === 0) {
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
  } else if (game.stage === 1) {
    if (!game.hand.hasDiscarded) {
      message.text = `Select two cards to put in ${wonFirstCrib ? 'your' : 'their'} crib`;
      message.action = 'discard';
      message.actionText = 'Discard';
    } else if (game.hand.hasDiscarded && !game.crib.hasAllCards) {
      message.text = `Waiting for ${opponent} to discard`;
    }
  } else if (game.stage === 2) {
    if (wonFirstCrib) {
      message.text = `Waiting for ${opponent} to begin pegging`;
    } else {
      message.text = 'Your lead, click a card to begin pegging';
    }
  }
  return message;
};

module.exports.getActionText = () => 'Deal!';
