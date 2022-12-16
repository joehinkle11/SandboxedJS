import {expect, test} from '@jest/globals';
import { safeEval } from '../src/SafeEval';

export function testSafeEvalAgainstNative(
  jsCode: string,
  testName: string = jsCode
) {
  test(testName, () => {
    let evalResult;
    try {
      evalResult = globalThis.eval(jsCode);
    } catch (e: any) {
      let safeEvalResult;
      try {
        safeEvalResult = 1000//safeEval(jsCode);
      } catch {
        expect("thew error").toBe("thew error");
        return
      }
      expect(safeEvalResult).toBe(`Native eval threw error '${e.message}'`)
      return
    }
    if (typeof evalResult === "object") {
      expect(JSON.stringify(safeEval(jsCode))).toBe(JSON.stringify(evalResult));
    } else {
      expect(safeEval(jsCode)).toBe(evalResult);
    }
  });
}