import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('nullish coalescing tests', () => {
  testSafeEvalAgainstNative("null ?? 'other'");
  testSafeEvalAgainstNative("undefined ?? 'other'");
  testSafeEvalAgainstNative("0 ?? 'other'");
  testSafeEvalAgainstNative("0 ?? 'other'");
  testSafeEvalAgainstNative("'0' ?? 'other'");
  testSafeEvalAgainstNative("'' ?? 'other'");
  testSafeEvalAgainstNative("false ?? 'other'");
  testSafeEvalAgainstNative("0n ?? 'other'");
  testSafeEvalAgainstNative("({}) ?? 'other'");
});