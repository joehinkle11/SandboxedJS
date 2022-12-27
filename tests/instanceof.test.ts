import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('instanceof tests', () => {
  testSafeEvalAgainstNative(`
    const o1 = {};
    const o2 = {};
    Object.setPrototypeOf(o2, null);
    const o3 = {};
    Object.setPrototypeOf(o3, null);
    Object.setPrototypeOf(o3, Object.prototype);
    const o4 = {};
    Object.setPrototypeOf(o4, null);
    Object.setPrototypeOf(o4, Object);
    [o1 instanceof Object, o2 instanceof Object, o3 instanceof Object, o4 instanceof Object, null instanceof Object];
  `);
  testSafeEvalAgainstNative(`
    null instanceof null
  `);
  testSafeEvalAgainstNative(`
    const o = {};
    const f = function() {};
    o instanceof f;
  `);
  testSafeEvalAgainstNative(`
    const f = function() {};
    const o = new f();
    o instanceof f;
  `);
  testSafeEvalAgainstNative(`
    const p = function() {};
    const f = function() {};
    f.prototype = new p();
    const o = new f();
    [o instanceof f, o instanceof p];
  `);
  testSafeEvalAgainstNative(`
    const f = function() {};
    f.prototype = null;
    o instanceof f // throws
  `);
  testSafeEvalAgainstNative(`
    const f = function() {};
    const b = f.bind(null);
    const o = new b();
    o instanceof f;
  `);
});