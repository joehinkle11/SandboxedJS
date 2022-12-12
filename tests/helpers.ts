import {expect, test} from '@jest/globals';
import { safeEval } from '../src/SafeEval';

export function testSafeEvalAgainstNative(
  jsCode: string,
  testName: string = jsCode
) {
  test(testName, () => {
    try {
      const evalResult = eval(jsCode);
      expect(safeEval(jsCode)).toBe(evalResult);
    } catch (e: any) {
      try {
        expect(safeEval(jsCode)).toBe(`Native eval threw error ${e.toString()}`)
      } catch {
        expect("thew error").toBe("thew error");
      }
    }
  });
}