import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('basic numbers', () => {
  testSafeEvalAgainstNative("0");
  testSafeEvalAgainstNative("123");
  testSafeEvalAgainstNative("0.5");
  testSafeEvalAgainstNative(".5");
  testSafeEvalAgainstNative("-1");
  testSafeEvalAgainstNative("-1.2");
  testSafeEvalAgainstNative("NaN");
  testSafeEvalAgainstNative("Infinity");
  testSafeEvalAgainstNative("(-Infinity)");
});
describe('basic math operators', () => {
  testSafeEvalAgainstNative("+1");
  testSafeEvalAgainstNative("+NaN");
  testSafeEvalAgainstNative("(+Infinity)");
  testSafeEvalAgainstNative('+-+-+Infinity');
  testSafeEvalAgainstNative('-+-+-+-5.4');
  testSafeEvalAgainstNative('1 + 1');
  testSafeEvalAgainstNative('1 + NaN');
  testSafeEvalAgainstNative('1 + Infinity');
  testSafeEvalAgainstNative('1 - 1');
  testSafeEvalAgainstNative('1 - NaN');
  testSafeEvalAgainstNative('1 - Infinity');
  testSafeEvalAgainstNative('NaN + Infinity');
  testSafeEvalAgainstNative('10 + -48');
  testSafeEvalAgainstNative('10 + -48.123');
  testSafeEvalAgainstNative('10 + -48.123 + 23 + -28 + 0 + -0 + .23');
  testSafeEvalAgainstNative('10 - 48.123 + 23 - 28 + 0 + -0 + .23');
  testSafeEvalAgainstNative('true + 1');
  testSafeEvalAgainstNative('true - 1');
});