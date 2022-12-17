import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('global Object tests', () => {
  testSafeEvalAgainstNative("Object.name");
  testSafeEvalAgainstNative("Object.length");
  testSafeEvalAgainstNative("Object.getOwnPropertyNames({}).length");
  // testSafeEvalAgainstNative("Object.getOwnPropertyNames({})[0]");
  // testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true}).length");
  // testSafeEvalAgainstNative("Object.getOwnPropertyNames({a:true})[0]");
  // testSafeEvalAgainstNative("Object");
  // testSafeEvalAgainstNative("Object.toString()");
});