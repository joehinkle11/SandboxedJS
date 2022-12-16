import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('anonymous functions test', () => {
  testSafeEvalAgainstNative("(function(){})()");
  testSafeEvalAgainstNative("(function(){5})()");
  testSafeEvalAgainstNative("(function(){return 5})()");
  testSafeEvalAgainstNative("(function(){return 5+5})()");
  testSafeEvalAgainstNative("const x = 5;(function(){return x+5})()");
  testSafeEvalAgainstNative("let x = 5;(function(){return x+=5})()");
});