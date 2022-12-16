import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('anonymous functions test', () => {
  testSafeEvalAgainstNative("(function(){})()");
  testSafeEvalAgainstNative("(function(){5})()");
  testSafeEvalAgainstNative("(function(){return 5})()");
});