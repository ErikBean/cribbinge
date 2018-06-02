/* eslint-disable */
import { valueOf } from './deck';

export function pointValue(card) {
  return valueOf(card) > 10 ? 10 : valueOf(card);
}
