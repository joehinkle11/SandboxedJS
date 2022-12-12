import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('operator precedence', () => {
  testSafeEvalAgainstNative('100 + 50 * 3');
  testSafeEvalAgainstNative('(100 + 50) * 3');
  testSafeEvalAgainstNative('100 / 50 * 3');
});