import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('undefined tests', () => {
  testSafeEvalAgainstNative('undefined');
});