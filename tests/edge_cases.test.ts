import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('empty program', () => {
  testSafeEvalAgainstNative('');
});