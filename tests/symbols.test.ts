import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('symbols declaration and global tests', () => {
  testSafeEvalAgainstNative("typeof Symbol('a')");
  testSafeEvalAgainstNative("new Symbol('a') // throws");
  testSafeEvalAgainstNative("Symbol().description");
  testSafeEvalAgainstNative("Symbol('a').description");
  testSafeEvalAgainstNative("Symbol('a').toString()");
  testSafeEvalAgainstNative("Symbol.keyFor(Symbol('a')) // undefined");
  testSafeEvalAgainstNative("Symbol.for('hello') === Symbol.for('hello') // true");
  testSafeEvalAgainstNative("Symbol.for('hello') === Symbol.for('bye') // false");
  testSafeEvalAgainstNative("Symbol.keyFor(Symbol.for('hello')) // 'hello'");
});

describe('symbols property keys tests', () => {
  testSafeEvalAgainstNative(`
    const s1 = Symbol();
    const s2 = Symbol();
    const o = {};
    o[s1] = "s1";
    o[s2] = "s2";
    [o[s1], o[s2]];
  `);
});