import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('global Object tests', () => {
  // testSafeEvalAgainstNative("Object.name");
  // testSafeEvalAgainstNative("Object.length");
  // testSafeEvalAgainstNative("Object.getOwnPropertyNames()");
  // testSafeEvalAgainstNative("Object.getOwnPropertyNames({})");
  // testSafeEvalAgainstNative("Object.getOwnPropertyNames({})[0]");
  // testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true})");
  testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true})[0]");
  // testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true}).length");
  // testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true})[0]");
  // testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true})");
  // testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true},{b:true})");
  // testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true},{b:true})[0]");
  // testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true},{b:true})[1]");
  // testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true},{b:true})[1] === 'b'");
  // testSafeEvalAgainstNative("Object.toString()");
});