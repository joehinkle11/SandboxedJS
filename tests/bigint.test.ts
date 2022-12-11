import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('basic bigint', () => {
  testSafeEvalAgainstNative("0n");
  testSafeEvalAgainstNative("123n");
  testSafeEvalAgainstNative("-0n");
  testSafeEvalAgainstNative("-230n");
  testSafeEvalAgainstNative("2249823430n");
});

describe('bigint ops', () => {
  testSafeEvalAgainstNative("1n + 0n");
  testSafeEvalAgainstNative("10n + 0n");
  testSafeEvalAgainstNative("10n + 320n");
  testSafeEvalAgainstNative("10n - 32231230n");
  testSafeEvalAgainstNative("10n + -32231230n");
});