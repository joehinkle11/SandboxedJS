import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('try catch finally throw tests', () => {
  testSafeEvalAgainstNative(`
    try {
      1
    } catch {
      2
    }
  `);
  testSafeEvalAgainstNative(`
    const f = function() {
      try {
        return 1
      } catch {
        return 2
      }
    }
    f();
  `);
  testSafeEvalAgainstNative(`
    try {
      const x = 5;
      x(); // throws
      1;
    } catch {
      2
    }
  `);
  testSafeEvalAgainstNative(`
    try {
      throw undefined
      1;
    } catch {
      2
    }
  `);
  testSafeEvalAgainstNative(`
    try {
      throw 3
      1;
    } catch (e) {
      e
    }
  `);
  testSafeEvalAgainstNative(`
    try {
      throw 3
      1;
    } catch (e) {
      e + 2;
    }
  `);
  testSafeEvalAgainstNative(`
    let str = "";
    try {
      str += "1";
    } catch (e) {
      str += "2";
    } finally {
      str += "3";
    }
    str;
  `);
  testSafeEvalAgainstNative(`
    let str = "";
    try {
      str += "1";
      throw "error"
    } catch (e) {
      str += "2";
    } finally {
      str += "3";
    }
    str;
  `);
});