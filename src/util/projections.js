export function needsFirstCut (gameEvents) {
  // test that string ends with game initializer: 
  return /start>$/.test(gameEvents)
}

export function needsSecondCut (gameEvents) {
  // test that string ends with c1=<card>
  return /c1=[SCHD]\d{1,2}>$/.test(gameEvents)
}