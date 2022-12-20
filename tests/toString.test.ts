import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('toString tests', () => {
  testSafeEvalAgainstNative('5.5.toString()');
  testSafeEvalAgainstNative('true.toString()');
  testSafeEvalAgainstNative('({}).toString()');
  testSafeEvalAgainstNative('(new Number(1)).toString()');
  testSafeEvalAgainstNative('Object.prototype.toString.bind(new Number(2))()');
});
