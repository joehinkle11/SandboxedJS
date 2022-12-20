import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

// trying a bunch of operators and values
const valuePool = ["true","false","0","0n","0.5",".123","'asdf\"lo \nl'","-123","-234n","'hello'","null","undefined","(+NaN)","(-NaN)","Infinity","(-Infinity)","({})"];
const opsPool = ["+","-","*","/","**","%","&","|","~","^","<<",">>",">>>"];
const logicalOpsPool = ["&&","||"];

describe('binary operators', () => {
  for (const value1 of valuePool) {
    for (const value2 of valuePool) {
      // binary ops
      for (const op of opsPool) {
        testSafeEvalAgainstNative(`${value1} ${op} ${value2}`);
      }
      // nullish
      testSafeEvalAgainstNative(`${value1} ?? ${value2}`);
      // logical ops
      for (const op of logicalOpsPool) {
        testSafeEvalAgainstNative(`${value1} ${op} ${value2}`);
      }
    }
  }
});