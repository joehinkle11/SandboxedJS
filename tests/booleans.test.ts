import {describe, expect, test} from '@jest/globals';
import { safeEval } from '../src/SafeEval';

describe('basic booleans', () => {
  test('false is false', () => {
    expect(safeEval("false")).toBe(false);
  });
  test('true is true', () => {
    expect(safeEval("true")).toBe(true);
  });
});