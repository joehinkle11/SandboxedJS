import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('bound functions', () => {
  testSafeEvalAgainstNative(`
    const B = function() {};
    const bound1 = B.bind(null);
    const bound2 = bound1.bind(null);
    [B.name, bound1.name, bound2.name];
  `);
  testSafeEvalAgainstNative(`
    const f = function() {};
    const p = Object.create(Function.prototype)
    Object.setPrototypeOf(f, p);
    const b = f.bind({});
    const r1 = [Object.getPrototypeOf(b) === Object.getPrototypeOf(f), Object.getPrototypeOf(b) === p];
    Object.setPrototypeOf(f, Function.prototype);
    const r2 = [Object.getPrototypeOf(b) === Object.getPrototypeOf(f), Object.getPrototypeOf(b) === p];
    [r1, r2];
  `);
  testSafeEvalAgainstNative(`
    const F = function() {};
    const B = F.bind(null);
    const f = new F();
    const b = new B();
    [f === B, Object.getPrototypeOf(f) === Object.getPrototypeOf(b), F.name, B.name];
  `);
});
