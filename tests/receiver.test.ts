import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative, testSafeEvalAgainstNativeCustom } from './helpers';

describe('receiver tests', () => {
  testSafeEvalAgainstNative(`
    todo
  `);
});