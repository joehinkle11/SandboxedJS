import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('anonymous functions test', () => {
  // testSafeEvalAgainstNative("(()=>{})()");
  testSafeEvalAgainstNative("5");
});