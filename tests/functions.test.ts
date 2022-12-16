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

describe('function names tests', () => {
  testSafeEvalAgainstNative(`(function () {}).name`);
  testSafeEvalAgainstNative(`(function y() {}).name`);
  testSafeEvalAgainstNative(`
    const x = function() {}
    x.name;
  `);
  testSafeEvalAgainstNative(`
    const x = function y() {}
    x.name;
  `);
});

describe('anonymous functions assignment tests', () => {
  testSafeEvalAgainstNative("const x = (function(){return 5+5});x()");
  testSafeEvalAgainstNative("const x = (function(){return 5+5});const y = x;y()");
});

describe('function args tests', () => {
  testSafeEvalAgainstNative("(function(){return arguments})(1)");
  testSafeEvalAgainstNative("(function(){return arguments})(1,2)");
  testSafeEvalAgainstNative("(function(){return arguments})(1,2,3)");
  testSafeEvalAgainstNative("(function(){return arguments.length})(1,2,3)");
  testSafeEvalAgainstNative("(function(){return a})(1,2,3)");
  testSafeEvalAgainstNative("(function(a){return a})(1,2,3)");
  testSafeEvalAgainstNative("(function(a, b, c){return [a, b, c]})(1,2,3)");
});

describe('basic "this" binding tests', () => {
  testSafeEvalAgainstNative(`
    const x = function() { return this.y }
    const o = { y: true, x: x }
    o.x();
  `);
  testSafeEvalAgainstNative(`
    const x = function() { return this?.y }
    const o = { y: true, x: x }
    const o_x = o.x;
    o_x();
  `);
});