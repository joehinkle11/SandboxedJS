import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('autoboxing tests', () => {
  testSafeEvalAgainstNative("({[1]:true})");
  testSafeEvalAgainstNative("1.1.valueOf()");
  testSafeEvalAgainstNative("({[new Number(1)]:true})");
  testSafeEvalAgainstNative("true.valueOf()");
  testSafeEvalAgainstNative("false.valueOf()");
});