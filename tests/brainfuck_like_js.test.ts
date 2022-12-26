import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('brainfuck', () => {
  testSafeEvalAgainstNative("![] // false");
  testSafeEvalAgainstNative("!![] // true");
  testSafeEvalAgainstNative("+![] // 0");
  testSafeEvalAgainstNative("+!![] // 1");
  testSafeEvalAgainstNative("[][[]] // undefined");
  testSafeEvalAgainstNative("+!![] / +![] // Infinity");
  testSafeEvalAgainstNative("+!![] / +![] // Infinity");
  testSafeEvalAgainstNative("[] + {} // '[object Object]'");
  testSafeEvalAgainstNative("+{} // NaN");
});
