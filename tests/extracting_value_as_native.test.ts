import {describe} from '@jest/globals';
import { safeEval } from '../src/SafeEval';

describe('extracting value as native js value tests', () => {
  test("toString works on proxied sandboxed value", () => {
    const safeEvalResult = safeEval("({a:true})");
    const toStringed = safeEvalResult.toString();
    expect(toStringed).toBe(({a:true}).toString());
  });
});

