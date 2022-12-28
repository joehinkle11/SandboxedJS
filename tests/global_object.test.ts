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
  testSafeEvalAgainstNative(`
    const o = {};
    Object.defineProperty(o, "y", {value: 5});
    o.y;
  `);
  testSafeEvalAgainstNative(`
    const o = {};
    const p = {value: 5}
    const setup = Object.create(p);
    Object.defineProperty(o, "y", setup);
    o.y;
  `);
  testSafeEvalAgainstNative(`
    const o = {};
    Object.defineProperty(o, "y", {get: function(){return 5}});
    o.y;
  `);
  testSafeEvalAgainstNative(`
    const outside = "hi";
    const o = {};
    Object.defineProperty(o, "y", {get: function(){return outside}});
    o.y;
  `);
  testSafeEvalAgainstNative(`
    let outside = "hi";
    const o = {};
    Object.defineProperty(o, "y", {get: function(){return outside += "more"}});
    const y = o.y;
    [outside, y];
  `);
  testSafeEvalAgainstNative(`
    let outside = "hi";
    const o = {};
    Object.defineProperty(o, "y", {get: function(){return outside += "more"}});
    o.y;
    o.y;
  `);
  testSafeEvalAgainstNative(`
    const o = {};
    Object.defineProperty(o, "y", {set: function(v){this.x = v}});
    o.y = 5;
    o.x;
  `);
  testSafeEvalAgainstNative(`
    let num = 0;
    const o = {};
    Object.defineProperty(o, "y", {set: function(v){num += v}});
    o.y = 5;
    o.y = 8;
    num;
  `);
  testSafeEvalAgainstNative(`
    const o = {x:true};
    Object.defineProperty(o, "y", {get: function(){return this.x}});
    o.y;
  `);
  testSafeEvalAgainstNative(`
    const p = {};
    Object.defineProperty(p, "y", {get: function(){return this.x}});
    const o = Object.create(p);
    o.x = 14;
    o.y;
  `);
});

