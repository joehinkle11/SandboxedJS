import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('basic arrays', () => {
  testSafeEvalAgainstNative("[]");
  testSafeEvalAgainstNative("[].length");
  testSafeEvalAgainstNative("[1]");
  testSafeEvalAgainstNative("[1].length");
  testSafeEvalAgainstNative("[1, 2]");
  testSafeEvalAgainstNative("[1, 2].length");
});

describe('array index lookup', () => {
  testSafeEvalAgainstNative("[1][0]");
  testSafeEvalAgainstNative("[1][1]");
  testSafeEvalAgainstNative("[1, 2][0]");
  testSafeEvalAgainstNative("[1, 2][1]");
});

describe('2d arrays', () => {
  testSafeEvalAgainstNative("[[]]");
  testSafeEvalAgainstNative("[[]].length");
  testSafeEvalAgainstNative("[[1]]");
  testSafeEvalAgainstNative("[[1]].length");
  testSafeEvalAgainstNative("[[1], [2]]");
  testSafeEvalAgainstNative("[[1], [2]].length");
  testSafeEvalAgainstNative("[0, 'a', ['b']][[[1], [2]].length]");
});
