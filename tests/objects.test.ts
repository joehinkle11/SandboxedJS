import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('simple js object property access', () => {
  testSafeEvalAgainstNative("({}).a");
  testSafeEvalAgainstNative("({}).Infinity");
  testSafeEvalAgainstNative("({}).NaN");
  testSafeEvalAgainstNative("({a:4}).b");
  testSafeEvalAgainstNative("({a:4}).a");
  testSafeEvalAgainstNative("({Infinity:4}).Infinity");
});