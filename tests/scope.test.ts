import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('simple scope tests', () => {
  testSafeEvalAgainstNative("5");
  // testSafeEvalAgainstNative(`
  //   const x = 5;x
  // `);
  // testSafeEvalAgainstNative(`
  //   const y = x
  //   const x = 5;y
  // `);
});