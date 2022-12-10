import {expect, test} from '@jest/globals';
import { safeEval } from '../src/SafeEval';

export function testSafeEvalAgainstNative(
  jsCode: string,
  testName: string = jsCode
) {
  test(testName, () => {
    expect(safeEval(jsCode)).toBe(eval(jsCode));
  });
}