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

  testSafeEvalAgainstNative(`Object.is(NaN, NaN); // -> true`);
  testSafeEvalAgainstNative(`NaN === NaN; // -> false`);
  
  testSafeEvalAgainstNative(`Object.is(-0, 0); // -> false`);
  testSafeEvalAgainstNative(`-0 === 0; // -> true`);
  
  testSafeEvalAgainstNative(`Object.is(NaN, 0 / 0); // -> true`);
  testSafeEvalAgainstNative(`NaN === 0 / 0; // -> false`);

  testSafeEvalAgainstNative(`![] + []; // -> 'false'`);
  testSafeEvalAgainstNative(`"false"[0]; // -> 'f'`);
  testSafeEvalAgainstNative(`+!+[]`)
  testSafeEvalAgainstNative(`+[]`)
  testSafeEvalAgainstNative(`(![] + [])`);
  testSafeEvalAgainstNative(`(![] + [])[+[]]`);
  testSafeEvalAgainstNative(`(![] + [])[+[]] +
    (![] + [])[+!+[]] +
    ([![]] + [][[]])[+!+[] + [+[]]] +
    (![] + [])[!+[] + !+[]];
  // -> 'fail'`);

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

  testSafeEvalAgainstNative(`Number.MIN_VALUE > 0; // -> true`);

  testSafeEvalAgainstNative(`// Declare a class which extends null
  class Foo extends null {}
  // -> [Function: Foo]
  
  new Foo() instanceof null;
  // > TypeError: function is not a function
  // >     at … … …`);

  testSafeEvalAgainstNative(`Object.getPrototypeOf(Foo.prototype); // -> null`);

  testSafeEvalAgainstNative(`typeof null === "object";`);

  testSafeEvalAgainstNative(`[1, 2, 3] + [4, 5, 6]; // -> '1,2,34,5,6'`);

  testSafeEvalAgainstNative(`[, , ,].length; // -> 3`);
  
  testSafeEvalAgainstNative(`[, , ,].toString(); // -> ',,'`);

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

  testSafeEvalAgainstNative(`Number(); // -> 0`);
  testSafeEvalAgainstNative(`Number(undefined); // -> NaN`);
  
  testSafeEvalAgainstNative(`parseInt("f*ck"); // -> NaN`);
  testSafeEvalAgainstNative(`parseInt("f*ck", 16); // -> 15`);

  //
  testSafeEvalAgainstNative(`parseInt("Infinity", 10); // -> NaN`);
  // ...
  testSafeEvalAgainstNative(`parseInt("Infinity", 18); // -> NaN...`);
  testSafeEvalAgainstNative(`parseInt("Infinity", 19); // -> 18`);
  // ...
  testSafeEvalAgainstNative(`parseInt("Infinity", 23); // -> 18...`);
  testSafeEvalAgainstNative(`parseInt("Infinity", 24); // -> 151176378`);
  // ...
  testSafeEvalAgainstNative(`parseInt("Infinity", 29); // -> 385849803`);
  testSafeEvalAgainstNative(`parseInt("Infinity", 30); // -> 13693557269`);
  // ...
  testSafeEvalAgainstNative(`parseInt("Infinity", 34); // -> 28872273981`);
  testSafeEvalAgainstNative(`parseInt("Infinity", 35); // -> 1201203301724`);
  testSafeEvalAgainstNative(`parseInt("Infinity", 36); // -> 1461559270678...`);
  testSafeEvalAgainstNative(`parseInt("Infinity", 37); // -> NaN`);

  testSafeEvalAgainstNative(`parseInt(null, 24); // -> 23`);

  testSafeEvalAgainstNative(`parseInt("06"); // 6`);
  testSafeEvalAgainstNative(`parseInt("08"); // 8 if support ECMAScript 5`);
  testSafeEvalAgainstNative(`parseInt("08"); // 0 if not support ECMAScript 5`);
  
  // todo: lambdas
  // testSafeEvalAgainstNative(`parseInt({ toString: () => 2, valueOf: () => 1 }); // -> 2`);
  // testSafeEvalAgainstNative(`Number({ toString: () => 2, valueOf: () => 1 }); // -> 1`);

  testSafeEvalAgainstNative(`parseInt(0.000001); // -> 0`);
  testSafeEvalAgainstNative(`parseInt(0.0000001); // -> 1`);
  testSafeEvalAgainstNative(`parseInt(1 / 1999999); // -> 5`);

  testSafeEvalAgainstNative(`true + true; // -> 2`);
  testSafeEvalAgainstNative(`(true + true) * (true + true) - true; // -> 3`);
  
  // seems to be an issue with acorn
  // testSafeEvalAgainstNative(`// valid comment
  // <!-- valid comment too`);

  testSafeEvalAgainstNative(`typeof NaN; // -> 'number'`);

  testSafeEvalAgainstNative(`typeof []; // -> 'object'`);
  testSafeEvalAgainstNative(`typeof null; // -> 'object'`);

  // todo: support instanceof
  // testSafeEvalAgainstNative(`null instanceof Object; // false`);

  testSafeEvalAgainstNative(`999999999999999; // -> 999999999999999`);
  testSafeEvalAgainstNative(`9999999999999999; // -> 10000000000000000`);

  testSafeEvalAgainstNative(`10000000000000000; // -> 10000000000000000`);
  testSafeEvalAgainstNative(`10000000000000000 + 1; // -> 10000000000000000`);
  testSafeEvalAgainstNative(`10000000000000000 + 1.1; // -> 10000000000000002`);


  testSafeEvalAgainstNative(`0.1 + 0.2; // -> 0.30000000000000004`);
  testSafeEvalAgainstNative(`0.1 + 0.2 === 0.3; // -> false`);

  
  testSafeEvalAgainstNative(`
    Number.prototype.isOne = function() {
      return Number(this) === 1;
    };
    [
      (1.0).isOne(), // -> true
      (1).isOne(), // -> true
      (2.0).isOne(), // -> false
      (7).isOne(), // -> false
    ];
  `);

  testSafeEvalAgainstNative(`1 < 2 < 3; // -> true`);
  testSafeEvalAgainstNative(`3 > 2 > 1; // -> false`);
  testSafeEvalAgainstNative(`3 > 2 >= 1; // true`);

  testSafeEvalAgainstNative(`3  - 1  // -> 2`);
  testSafeEvalAgainstNative(`3  + 1  // -> 4`);
  testSafeEvalAgainstNative(`'3' - 1  // -> 2`);
  testSafeEvalAgainstNative(`'3' + 1  // -> '31'`);
 
  testSafeEvalAgainstNative(`'' + '' // -> ''`);
  testSafeEvalAgainstNative(`[] + [] // -> ''`);
  testSafeEvalAgainstNative(`{} + [] // -> 0`);
  testSafeEvalAgainstNative(`({} + []); // -> [object Object]`);
  testSafeEvalAgainstNative(`[] + {} // -> '[object Object]'`);
  testSafeEvalAgainstNative(`{} + {} // -> '[object Object][object Object]'`);
 
  testSafeEvalAgainstNative(`'222' - -'111' // -> 333`);
 
  testSafeEvalAgainstNative(`[4] * [4]       // -> 16`);
  testSafeEvalAgainstNative(`[] * []         // -> 0`);
  testSafeEvalAgainstNative(`[4, 4] * [4, 4] // NaN`);

  // todo: support regex
  // testSafeEvalAgainstNative(`
  //   // Patch a toString method
  //   RegExp.prototype.toString =
  //   function() {
  //     return this.source;
  //   } /
  //   7 /
  //   -/5/; // -> 2
  // `);

  testSafeEvalAgainstNative(`"str"; // -> 'str'`);
  testSafeEvalAgainstNative(`typeof "str"; // -> 'string'`);
  testSafeEvalAgainstNative(`"str" instanceof String; // -> false`);
});