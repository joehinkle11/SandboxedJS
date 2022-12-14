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
  testSafeEvalAgainstNative("Number.MAX_VALUE");
  testSafeEvalAgainstNative("Number.MIN_VALUE");
  testSafeEvalAgainstNative("Number.EPSILON");
  testSafeEvalAgainstNative("Number.NaN");
  testSafeEvalAgainstNative("MAX_SAFE_INTEGER");
  testSafeEvalAgainstNative("MIN_SAFE_INTEGER");
  testSafeEvalAgainstNative("NEGATIVE_INFINITY");
  testSafeEvalAgainstNative("POSITIVE_INFINITY");
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

describe('use of global "Number" tests', () => {
  testSafeEvalAgainstNative('Number(1.3)');
  testSafeEvalAgainstNative('new Number(1.3).valueOf()');
});