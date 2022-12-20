import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative, testSafeEvalAgainstNativeCustom } from './helpers';

describe('number wrapper tests', () => {
  testSafeEvalAgainstNative("(new Number(1)).valueOf()");
  testSafeEvalAgainstNative("const n = new Number(1);n.valueOf()");
  testSafeEvalAgainstNative("const n = new Number(1);n.x = 5;n.x");
  testSafeEvalAgainstNative("const n = new Number(1);n.x = 5;n.valueOf()");
  testSafeEvalAgainstNative("const n = new Number(1);n.x = 5;[n.x, n.valueOf()]");
  // testSafeEvalAgainstNative("new Number(1)");
  // testSafeEvalAgainstNative("const n = new Number(1);n.x = 5;[n,n.x]");
  // testSafeEvalAgainstNativeCustom("const n = new Number(1);n.x = 5;n", (o) => o.x);
});