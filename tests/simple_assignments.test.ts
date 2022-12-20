import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('simple assignments test', () => {
  testSafeEvalAgainstNative("var x = 5;x");
  testSafeEvalAgainstNative("var x = 15;x");
  testSafeEvalAgainstNative("x = 2;x");
  testSafeEvalAgainstNative("let x = 2;x = x + 2;x");
  testSafeEvalAgainstNative("let x = 2;x += 2.5;x");
});