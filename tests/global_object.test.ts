import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('global Object tests', () => {
  testSafeEvalAgainstNative("Object.name");
  testSafeEvalAgainstNative("Object.length");
  testSafeEvalAgainstNative("Object.getOwnPropertyNames()");
  testSafeEvalAgainstNative("Object.getOwnPropertyNames({})");
  testSafeEvalAgainstNative("Object.getOwnPropertyNames({})[0]");
  testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true})");
  testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true})[0]");
  testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true}).length");
  testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true})[0]");
  testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true})");
  testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true},{b:true})");
  testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true},{b:true})[0]");
  testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true},{b:true})[1]");
  testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true},{b:true})[1] === 'b'");
  testSafeEvalAgainstNative("Object.toString().includes('[native code]')");
  testSafeEvalAgainstNative("Object.prototype.constructor === Object");
  testSafeEvalAgainstNative("Object.create(null)");
  testSafeEvalAgainstNative("Object.create(null).a");
  testSafeEvalAgainstNative("Object.create({}).a");
  testSafeEvalAgainstNative("Object.create({a:true}).a");
  testSafeEvalAgainstNative("Object.getPrototypeOf(Object.create(null)) === null");
  testSafeEvalAgainstNative("Object.getPrototypeOf(Object.create(null))");
  testSafeEvalAgainstNative("Object.getPrototypeOf(Object.create({})) !== null");
  testSafeEvalAgainstNative("Object.getPrototypeOf(Object.create({})) !== {}");
  testSafeEvalAgainstNative("const o = {};Object.getPrototypeOf(Object.create(o)) === o");
  testSafeEvalAgainstNative("const o = {};const o2 = Object.create(o); Object.getPrototypeOf(o2) === o");
  testSafeEvalAgainstNative("const o = {};const o2 = Object.create(o); Object.setPrototypeOf(o2, null);Object.getPrototypeOf(o2) !== o");
});

