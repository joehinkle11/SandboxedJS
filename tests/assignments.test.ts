import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('basic assignments test', () => {
  testSafeEvalAgainstNative("var x = 5;x");
  testSafeEvalAgainstNative("var x = 15;x");
  testSafeEvalAgainstNative("x = 2;x");
  testSafeEvalAgainstNative("let x = 2;x = x + 2;x");
  testSafeEvalAgainstNative("let x = 2;x += 2.5;x");
});

const valuePool = ["true","false","0","0n","0.5",".123","'asdf\"lo \nl'","-123","-234n","'hello'","null","undefined","+NaN","-NaN","Infinity","-Infinity","({})"];
const opsPool = ["=","+=","-=","*=","/=","%=","**=","<<=",">>=",">>>=","&=","^=","|=","&&","||","??="];

describe('compound assignment operators', () => {
  for (const value1 of valuePool) {
    for (const value2 of valuePool) {
      for (const op of opsPool) {
        testSafeEvalAgainstNative(`let x = ${value1};x ${op} ${value2};x`);
        testSafeEvalAgainstNative(`let x = ${value1};x ${op} ${value2}`);
      }
    }
  }
});