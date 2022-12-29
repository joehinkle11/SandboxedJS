import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('destructuring test', () => {
  testSafeEvalAgainstNative(`
    const [a, b] = [10, 20];
    [a, b];
  `);
});