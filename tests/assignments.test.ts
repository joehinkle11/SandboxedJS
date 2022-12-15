import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('basic assignments test', () => {
  testSafeEvalAgainstNative("5");
  // testSafeEvalAgainstNative("var x = 5;x");
  // testSafeEvalAgainstNative("x = 5;x");
});

// describe('local assignments test', () => {
//   testSafeEvalAgainstNative("const x = 5");
//   testSafeEvalAgainstNative("let x = 5");
// });

// describe('global assignments test', () => {
//   testSafeEvalAgainstNative("x = 5");
// });