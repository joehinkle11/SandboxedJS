import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative, testSafeEvalAgainstNativeCustom } from './helpers';

describe('reflect tests', () => {
  testSafeEvalAgainstNative(`typeof Reflect`);
  testSafeEvalAgainstNative(`Object.getPrototypeOf(Reflect) === Object.prototype`);
  testSafeEvalAgainstNative(`Reflect.get({a:true}, "a") // true`);
  testSafeEvalAgainstNative(`Reflect.get({a:true}, "a", null) // true`);
  testSafeEvalAgainstNative(`Reflect.get({a:true}, "a", {}) // true`);
  testSafeEvalAgainstNative(`
    const F = function() {
      Object.defineProperty(this, "y", {
        get: function(d) {
          return this.x;
        }
      })
    };
    const o1 = new F();
    const o2 = new F();
    o1.x = 1
    o2.x = 2
    const r1 = [o1.x, o1.y, Reflect.get(o1, "y", o1)];
    const r2 = [o2.x, o2.y, Reflect.get(o1, "y", o2)];
    [r1, r2];
  `);
});