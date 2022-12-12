import {expect, test} from '@jest/globals';
import { safeEval } from '../src/SafeEval';

export function testSafeEvalAgainstNative(
  jsCode: string,
  testName: string = jsCode
) {
  test(testName, () => {
    let evalResult;
    try {
      evalResult = eval(jsCode);
    } catch (e: any) {
      let safeEvalResult;
      try {
        safeEvalResult = safeEval(jsCode);
      } catch {
        expect("thew error").toBe("thew error");
        return
      }
      expect(safeEvalResult).toBe(`Native eval threw error '${e.message}'`)
      return
    }
    expect(safeEval(jsCode)).toBe(evalResult);
  });
}