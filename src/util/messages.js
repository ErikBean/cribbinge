module.exports.getMessage = (game, { currentUser, opponent } = {}) => {
  const message = {
    text: 'Error: Could not find message for game state',
    action: '',
    actionText: '',
  };
  const { hasCutForFirstCrib, shownCuts, winner } = game.cutsForFirstCrib;
  const waitingForOtherCutForFirstCrib = hasCutForFirstCrib && shownCuts.length === 1;

  const wonFirstCrib = winner === currentUser;
  const lostFirstCrib = winner === opponent;

  if (!hasCutForFirstCrib) {
    message.text = 'Cut for the first crib';
  } else if (waitingForOtherCutForFirstCrib) {
    message.text = `Waiting for ${opponent} to cut for first crib`;
  } else if (wonFirstCrib) { // TODO: Need a way to determine if we are past this point already
    message.text = 'You won the first crib! Deal the first hand';
    message.action = 'deal';
    message.actionText = 'Deal!';
  } else if (lostFirstCrib) {
    message.text = `${opponent} won the first crib. Wait for them to deal`;
  }
  return message;
};

module.exports.getActionText = () => 'Deal!';
