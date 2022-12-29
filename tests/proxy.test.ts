import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative, testSafeEvalAgainstNativeCustom } from './helpers';

describe('proxy tests', () => {
  testSafeEvalAgainstNative(`typeof Proxy`);
  testSafeEvalAgainstNative(`Proxy() // throws`);
  testSafeEvalAgainstNative(`new Proxy({}) // throws`);
  testSafeEvalAgainstNative(`new Proxy({a: true}, {}).a`);
  testSafeEvalAgainstNative(`typeof new Proxy({}, {})`);
  testSafeEvalAgainstNative(`typeof new Proxy(function(){}, {})`);
});