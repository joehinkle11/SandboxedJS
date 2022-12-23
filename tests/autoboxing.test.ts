import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('autoboxing tests', () => {
  testSafeEvalAgainstNative("({[0]:true})[-0]");
  testSafeEvalAgainstNative("({[0]:true})[0]");
  testSafeEvalAgainstNative("({[1]:true})[1]");
  testSafeEvalAgainstNative("({[1]:true})[0]");
  testSafeEvalAgainstNative("({[1]:true})");
  testSafeEvalAgainstNative("1.1.valueOf()");
  testSafeEvalAgainstNative("({[new Number(1)]:true})");
  testSafeEvalAgainstNative("true.valueOf()");
  testSafeEvalAgainstNative("false.valueOf()");
});