import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('constructor tests', () => {
  testSafeEvalAgainstNative(`
    const f = function() {
      this.x = 5;
    };
    new f();
  `);
  testSafeEvalAgainstNative(`
    const f = function() {
      this.x = 5;
    };
    (new f()).x;
  `);
  testSafeEvalAgainstNative(`
    const f = function() {
      const hidden = 5
      this.getterFunc = function() {return hidden};
    };
    return (new f()).getterFunc();
  `);
  testSafeEvalAgainstNative(`
    const f = function() {
      let hidden = 5
      this.getterFunc = function() {return hidden};
      this.addToHidden = function() {hidden += 1};
    };
    const o = new f();
    const before = o.getterFunc();
    o.addToHidden();
    const after = o.getterFunc();
    return [before, after];
  `);
  testSafeEvalAgainstNative(`
    const Parent = function() {
      this.isParent = true;
    };
    const Child = function() {
      this.isChild = true;
    };
    Child.prototype = new Parent();
    const o = new Child();
    [o, o.isChild, o.isParent];
  `);
  testSafeEvalAgainstNative(`
    const Parent = function() {
      this.isParent = true;
    };
    const Child = function() {
      this.isChild = true;
    };
    Child.prototype = new Parent();
    const o1 = new Child();
    const o1_result = [o1, o1.isChild, o1.isParent];
    Child.prototype = null;
    const o2 = new Child();
    const o2_result = [o2, o2.isChild, o2.isParent];
    const o1_result_after = [o1, o1.isChild, o1.isParent];
    [o1_result, o2_result, o1_result_after];
  `);
});