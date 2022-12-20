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
        safeEvalResult = safeEval(jsCode);
      } catch {
        expect("threw error").toBe("threw error");
        return
      }
      expect(safeEvalResult).toBe(`Native eval threw error '${e.message}'`)
      return
    }
    if (typeof evalResult === "object") {
      const safeEvalResult = safeEval(jsCode);
      const safeEvalResultStr = JSON.stringify(safeEvalResult);
      const evalResultStr = JSON.stringify(evalResult);
      expect(safeEvalResultStr).toBe(evalResultStr);
    } else {
      const safeEvalResult = safeEval(jsCode);
      expect(safeEvalResult).toBe(evalResult);
    }
  });
}
export function testSafeEvalAgainstNativeCustom(
  jsCode: string,
  checkObjectProperty: (resultObj: any) => any,
  testName: string = jsCode
) {
  test(testName, () => {
    let evalResult = globalThis.eval(jsCode);
    const safeEvalResult = safeEval(jsCode);
    const safeEvalResultStr = JSON.stringify(safeEvalResult);
    const evalResultStr = JSON.stringify(evalResult);
    expect(safeEvalResultStr).toBe(evalResultStr);
    expect(checkObjectProperty(safeEvalResult)).toBe(checkObjectProperty(evalResult));
  });
}