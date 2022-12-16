import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('anonymous functions tests', () => {
  testSafeEvalAgainstNative("(function(){})()");
  testSafeEvalAgainstNative("(function(){5})()");
  testSafeEvalAgainstNative("(function(){return 5})()");
  testSafeEvalAgainstNative("(function(){return 5+5})()");
  testSafeEvalAgainstNative("const x = 5;(function(){return x+5})()");
  testSafeEvalAgainstNative("let x = 5;(function(){return x+=5})()");
});

describe('anonymous functions assignment tests', () => {
  testSafeEvalAgainstNative("const x = (function(){return 5+5});x()");
  testSafeEvalAgainstNative("const x = (function(){return 5+5});const y = x;y()");
});

describe('basic "this" binding tests', () => {
  testSafeEvalAgainstNative(`
    const x = function() { return this.y }
    const o = { y: true, x: x }
    o.x()
  `);
});