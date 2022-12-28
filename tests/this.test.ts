import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('this tests', () => {
  testSafeEvalAgainstNative(`
    const f = function() {
      this.getterFunc = function() {
        return this.x;
      };
    };
    const o = new f();
    o.x = 5;
    o.getterFunc();
  `);
  testSafeEvalAgainstNative(`
    const Parent = function() {
      this.getterFuncP = function() {
        return this.x;
      };
    };
    const Child = function() {
      this.getterFuncC = function() {
        return this.getterFuncP();
      };
    };
    Child.prototype = new Parent();
    const o = new Child();
    o.x = 5;
    [o.getterFuncP()), o.getterFuncC()];
  `);
});