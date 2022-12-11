import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('undefined tests', () => {
  testSafeEvalAgainstNative('undefined');
  testSafeEvalAgainstNative('undefined + undefined');
  testSafeEvalAgainstNative('undefined - undefined');
  testSafeEvalAgainstNative('1 + undefined');
  testSafeEvalAgainstNative('1 - undefined');
  testSafeEvalAgainstNative('true + undefined');
  testSafeEvalAgainstNative('false + undefined');
  testSafeEvalAgainstNative('true - undefined');
  testSafeEvalAgainstNative('false - undefined');
  testSafeEvalAgainstNative('"hello" + undefined');
  testSafeEvalAgainstNative('"hello" - undefined');
  testSafeEvalAgainstNative('+undefined');
  testSafeEvalAgainstNative('-undefined');
});