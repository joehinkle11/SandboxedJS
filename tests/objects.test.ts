import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('simple js object property access', () => {
  testSafeEvalAgainstNative("({}).a");
  testSafeEvalAgainstNative("({}).Infinity");
  testSafeEvalAgainstNative("({}).NaN");
  testSafeEvalAgainstNative("({a:4}).b");
  testSafeEvalAgainstNative("({a:4}).a");
  testSafeEvalAgainstNative("({Infinity:4}).Infinity");
  testSafeEvalAgainstNative("({a:4})");
  testSafeEvalAgainstNative("({Infinity:4})");
  testSafeEvalAgainstNative("({NaN:Infinity})");
  testSafeEvalAgainstNative("({Infinity:NaN})");
  testSafeEvalAgainstNative("({a:4,b:6})");
  testSafeEvalAgainstNative("({a:4,b:6,'sdf':45})");
  testSafeEvalAgainstNative("({a:4,b:6,'3':42})");
  testSafeEvalAgainstNative("({a:4,b:6,[3]:42})");
  testSafeEvalAgainstNative("({a:4,b:6,3:42})");
  testSafeEvalAgainstNative("({a:4,b:6,[234 + 23]:42})");
  testSafeEvalAgainstNative("({a:4,b:6,'3':{a:4,b:6,'3':42}})");
  testSafeEvalAgainstNative("({a:4,b:6,{a:{c:-.4},b:6,'3':42}}.a.c:{a:4,b:6,'3':42}})");
  testSafeEvalAgainstNative("({}) + ({})");
});