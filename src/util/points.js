/* eslint-disable import/prefer-default-export */
import { valueOf } from './deck';

export function pointValue(card) {
  if (typeof card !== 'string') {
    console.error('non string passed to pointValue: ', card);
  }
  return valueOf(card) > 10 ? 10 : valueOf(card);
}
