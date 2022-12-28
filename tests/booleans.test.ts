import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('basic booleans', () => {
  testSafeEvalAgainstNative('false');
  testSafeEvalAgainstNative('true');
});

describe('boolean ops', () => {
  testSafeEvalAgainstNative('+false');
  testSafeEvalAgainstNative('+true');
  testSafeEvalAgainstNative('-false');
  testSafeEvalAgainstNative('-true');
  testSafeEvalAgainstNative('true+false');
  testSafeEvalAgainstNative('true+true');
  testSafeEvalAgainstNative('false+true');
  testSafeEvalAgainstNative('false+false');
  testSafeEvalAgainstNative('true-true');
  testSafeEvalAgainstNative('true-false');
  testSafeEvalAgainstNative('false-true');
  testSafeEvalAgainstNative('false-false');
});

describe('boolean other', () => {
  testSafeEvalAgainstNative('true.toString()');
  testSafeEvalAgainstNative('false.toString()');
});