import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('simple js object property access', () => {
  testSafeEvalAgainstNative("true");
  // testSafeEvalAgainstNative("({a:4}).a");
  // testSafeEvalAgainstNative("({Infinity:4}).Infinity");
});