import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

// source: https://github.com/denysdovhan/wtfjs

describe('wtf tests', () => {
  testSafeEvalAgainstNative('[] == ![]; // -> true');

  testSafeEvalAgainstNative('true == []; // -> false');
  testSafeEvalAgainstNative('true == ![]; // -> false');

  testSafeEvalAgainstNative('false == []; // -> true');
  testSafeEvalAgainstNative('false == ![]; // -> true');

  testSafeEvalAgainstNative('!!"false" == !!"true"; // -> true');
  testSafeEvalAgainstNative('!!"false" === !!"true"; // -> true');

  testSafeEvalAgainstNative(`"b" + "a" + +"a" + "a"; // -> 'baNaNa'`);

  testSafeEvalAgainstNative(`NaN === NaN; // -> false`);

  // todo: add support for `Object` global
  // testSafeEvalAgainstNative(`Object.is(NaN, NaN); // -> true`);
  testSafeEvalAgainstNative(`NaN === NaN; // -> false`);
  
  // todo: add support for `Object` global
  // testSafeEvalAgainstNative(`Object.is(-0, 0); // -> false`);
  testSafeEvalAgainstNative(`-0 === 0; // -> true`);
  
  // todo: add support for `Object` global
  // testSafeEvalAgainstNative(`Object.is(NaN, 0 / 0); // -> true`);
  testSafeEvalAgainstNative(`NaN === 0 / 0; // -> false`);

  // todo: requires string lookups to work
  // testSafeEvalAgainstNative(`(![] + [])[+[]] +
  //   (![] + [])[+!+[]] +
  //   ([![]] + [][[]])[+!+[] + [+[]]] +
  //   (![] + [])[!+[] + !+[]];
  // // -> 'fail'`);

  testSafeEvalAgainstNative(`+![]          // -> 0`);
  testSafeEvalAgainstNative(`+!![]         // -> 1`);
  testSafeEvalAgainstNative(`!![]          // -> true`);
  testSafeEvalAgainstNative(`![]           // -> false`);
  testSafeEvalAgainstNative(`[][[]]        // -> undefined`);
  testSafeEvalAgainstNative(`+!![] / +![]  // -> Infinity`);
  testSafeEvalAgainstNative(`[] + {}       // -> "[object Object]"`);
  testSafeEvalAgainstNative(`+{}           // -> NaN`);
  
  testSafeEvalAgainstNative(`!![]       // -> true`);
  testSafeEvalAgainstNative(`[] == true // -> false`);

  testSafeEvalAgainstNative(`!!null; // -> false`);
  testSafeEvalAgainstNative(`null == false; // -> false`);

  testSafeEvalAgainstNative(`0 == false; // -> true`);
  testSafeEvalAgainstNative(`"" == false; // -> true`);

  // start: ⚠️ This is part of the Browser API and won't work in a Node.js environment 
  // todo: add `document` support
  // testSafeEvalAgainstNative(`document.all instanceof Object; // -> true`);
  // testSafeEvalAgainstNative(`typeof document.all; // -> 'undefined'`);

  // testSafeEvalAgainstNative(`document.all === undefined; // -> false`);
  // testSafeEvalAgainstNative(`document.all === null; // -> false`);

  // testSafeEvalAgainstNative(`document.all == null; // -> true`);
  // end

  // todo: add support for `Number` global
  // testSafeEvalAgainstNative(`Number.MIN_VALUE > 0; // -> true`);

  testSafeEvalAgainstNative(`// Declare a class which extends null
  class Foo extends null {}
  // -> [Function: Foo]
  
  new Foo() instanceof null;
  // > TypeError: function is not a function
  // >     at … … …`);

  // todo: add support for `Object` global
  // testSafeEvalAgainstNative(`Object.getPrototypeOf(Foo.prototype); // -> null`);

  testSafeEvalAgainstNative(`typeof null === "object";`);

  testSafeEvalAgainstNative(`[1, 2, 3] + [4, 5, 6]; // -> '1,2,34,5,6'`);

  testSafeEvalAgainstNative(`[, , ,].length; // -> 3`);
  // todo: `toString` support
  // testSafeEvalAgainstNative(`[, , ,].toString(); // -> ',,'`);

  testSafeEvalAgainstNative(`[] == ''   // -> true`);
  testSafeEvalAgainstNative(`[] == 0    // -> true`);
  testSafeEvalAgainstNative(`[''] == '' // -> true`);
  testSafeEvalAgainstNative(`[0] == 0   // -> true`);
  testSafeEvalAgainstNative(`[0] == ''  // -> false`);
  testSafeEvalAgainstNative(`[''] == 0  // -> true`);

  testSafeEvalAgainstNative(`[null] == ''      // true`);
  testSafeEvalAgainstNative(`[null] == 0       // true`);
  testSafeEvalAgainstNative(`[undefined] == '' // true`);
  testSafeEvalAgainstNative(`[undefined] == 0  // true`);

  testSafeEvalAgainstNative(`[[]] == 0  // true`);
  testSafeEvalAgainstNative(`[[]] == '' // true`);

  testSafeEvalAgainstNative(`[[[[[[]]]]]] == '' // true`);
  testSafeEvalAgainstNative(`[[[[[[]]]]]] == 0  // true`);

  testSafeEvalAgainstNative(`[[[[[[ null ]]]]]] == 0  // true`);
  testSafeEvalAgainstNative(`[[[[[[ null ]]]]]] == '' // true`);

  testSafeEvalAgainstNative(`[[[[[[ undefined ]]]]]] == 0  // true`);
  testSafeEvalAgainstNative(`[[[[[[ undefined ]]]]]] == '' // true`);
});