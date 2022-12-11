import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('null tests', () => {
  testSafeEvalAgainstNative('null');
  testSafeEvalAgainstNative('null + null');
  testSafeEvalAgainstNative('null - null');
  testSafeEvalAgainstNative('1 + null');
  testSafeEvalAgainstNative('1 - null');
  testSafeEvalAgainstNative('null + 34');
  testSafeEvalAgainstNative('null - 34');
  testSafeEvalAgainstNative('true + null');
  testSafeEvalAgainstNative('false + null');
  testSafeEvalAgainstNative('true - null');
  testSafeEvalAgainstNative('false - null');
  testSafeEvalAgainstNative('"hello" + null');
  testSafeEvalAgainstNative('"hello" - null');
  testSafeEvalAgainstNative('+null');
  testSafeEvalAgainstNative('-null');
});