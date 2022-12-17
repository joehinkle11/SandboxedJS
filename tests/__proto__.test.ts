import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('__proto__ tests', () => {
  testSafeEvalAgainstNative("({}).__proto__");
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