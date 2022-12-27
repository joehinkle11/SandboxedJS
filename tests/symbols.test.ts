import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('symbols tests', () => {
  testSafeEvalAgainstNative("typeof Symbol('a')");
  testSafeEvalAgainstNative("new Symbol('a') // throws");
  testSafeEvalAgainstNative("Symbol('a').description");
});