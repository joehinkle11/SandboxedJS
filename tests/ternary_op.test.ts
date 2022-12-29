import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

const valuePool = ["true","false","0","0n","0.5",".123","'asdf\"lo \nl'","-123","-234n","'hello'","null","undefined","(+NaN)","(-NaN)","Infinity","(-Infinity)","({})","([])","({a:true})","([1])","([0])"];

describe('ternary op tests', () => {
  for (const value1 of valuePool) {
    testSafeEvalAgainstNative(value1 + ' ? "left" : "right"');
  }
});