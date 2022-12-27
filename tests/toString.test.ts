import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('toString tests', () => {
  testSafeEvalAgainstNative('5.5.toString()');
  testSafeEvalAgainstNative('true.toString()');
  testSafeEvalAgainstNative('({}).toString()');
  testSafeEvalAgainstNative('[].toString()');
  testSafeEvalAgainstNative('[1,2].toString()');
  testSafeEvalAgainstNative('[1,[2]].toString()');
  testSafeEvalAgainstNative('[1,[2],[]].toString()');
  testSafeEvalAgainstNative('[1,[2],[1,2,3]].toString()');
  testSafeEvalAgainstNative('(new Number(1)).toString()');
  testSafeEvalAgainstNative('typeof Object.prototype.toString.bind');
  testSafeEvalAgainstNative('typeof Object.prototype.toString.bind({})');
  testSafeEvalAgainstNative('Object.prototype.toString.bind({})()');
  testSafeEvalAgainstNative('Object.prototype.toString.bind(new Number(2))()');
});
