import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

// trying a bunch of operators and values
const valuePool = ["true","false","0","0n","0.5",".123","'asdf\"lo \nl'","-123","-234n","'hello'","null","undefined","+NaN","-NaN","Infinity","-Infinity"];
const simpleOpsPool = ["+","-","typeof ","!"];

describe('simple unary operators', () => {
  for (const value of valuePool) {
    // unary ops
    for (const op of simpleOpsPool) {
      testSafeEvalAgainstNative(`${op}${value}`);
    }
  }
});