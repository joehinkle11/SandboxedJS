import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('__proto__ tests', () => {
  // testSafeEvalAgainstNative("({}).__proto__");
  testSafeEvalAgainstNative(`
    const p = {value: 5}
    Object.create(p).value;
  `);
});


// describe('weird __proto__ tests', () => {
//   testSafeEvalAgainstNative(`const o = {};
//     Object.defineProperty(o, "__proto__", {
//       value: 3
//     });
//     [Object.getPrototypeOf(o), o.__proto__, Object.getPrototypeOf(o) === Object.prototype];
//   `);
//   testSafeEvalAgainstNative(`const o = {__proto__: null};
//     Object.defineProperty(o, "__proto__", {
//       value: 3
//     });
//     [Object.getPrototypeOf(o), o.__proto__, Object.getPrototypeOf(o) === Object.prototype];
//   `);
//   testSafeEvalAgainstNative(`const o = {__proto__: null};
//     [Object.getPrototypeOf(o), o.__proto__, Object.getPrototypeOf(o) === Object.prototype];
//   `);
//   testSafeEvalAgainstNative(`const o = {__proto__: 3};
//     [Object.getPrototypeOf(o), o.__proto__, Object.getPrototypeOf(o) === Object.prototype];
//   `);
//   testSafeEvalAgainstNative(`const o = {__proto__: {}};
//     [Object.getPrototypeOf(o), o.__proto__, Object.getPrototypeOf(o) === Object.prototype];
//   `);
// });