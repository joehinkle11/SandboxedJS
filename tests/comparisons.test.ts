import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

// trying a bunch of comparison checks and values
const valuePool = ["true","false","0","0n","0.5",".123","'asdf\"lo \nl'","-123","-234n","'hello'","null","undefined","+NaN","-NaN","Infinity","-Infinity"];
const comparisonOpsPool = ["==","===","!=","!==",">","<",">=","<="];

describe('comparison tests', () => {
  for (const value1 of valuePool) {
    for (const value2 of valuePool) {
      for (const op of comparisonOpsPool) {
        testSafeEvalAgainstNative(`${value1} ${op} ${value2}`);
      }
    }
  }
});