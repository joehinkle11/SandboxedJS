import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('rest arguments', () => {
  testSafeEvalAgainstNative(`
    // throws
    const f = function(...rest, invalidArgAfterRest) {
      return rest;
    }
  `);
  testSafeEvalAgainstNative(`
    const f = function(...rest) {
      return rest;
    }
    f();
  `);
  testSafeEvalAgainstNative(`
    const f = function(...rest) {
      return rest;
    }
    f(1);
  `);
  testSafeEvalAgainstNative(`
    const f = function(...rest) {
      return rest;
    }
    f(1, 2);
  `);
  testSafeEvalAgainstNative(`
    const f = function(arg1, ...rest) {
      return [arg1, rest];
    }
    f(1, 2);
  `);
  testSafeEvalAgainstNative(`
    const f = function(arg1, ...rest) {
      return [arg1, rest];
    }
    f();
  `);
  testSafeEvalAgainstNative(`
    const f = function(arg1, ...rest) {
      return [arg1, rest];
    }
    f(1);
  `);
});