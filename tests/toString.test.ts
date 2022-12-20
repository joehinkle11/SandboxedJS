import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('toString tests', () => {
  testSafeEvalAgainstNative('5.5.toString()');
  testSafeEvalAgainstNative('true.toString()');
});
