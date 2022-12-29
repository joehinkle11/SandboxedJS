import {expect, test, describe, } from '@jest/globals';
import { safeEval } from '../src/SafeEval';

describe('expose host variables tests', () => {
  test("Protect non-exposed variables", () => {
    let x = 5;
    try {
      safeEval("x");
      expect(true).toBe(false);
    } catch {
      expect(true).toBe(true);
    }
  });
  test("Disallow non-primitive variable exposure", () => {
    let x = {};
    try {
      safeEval("x", {
        exposing: {
          x: {
            getter() {
              return x
            },
          }
        }
      });
      expect(true).toBe(false);
    } catch {
      expect(true).toBe(true);
    }
  });
  test("Expose explicitly whitelisted primitive variables", () => {
    let x = 5;
    const result = safeEval("x", {
      exposing: {
        x: {
          getter() {
            return x
          },
        }
      }
    });
    expect(result).toBe(x);
  });
  test("Set exposed variable", () => {
    let x = 5;
    const result = safeEval("x = 15;x", {
      exposing: {
        x: {
          getter() {
            return x
          },
          setter(newValue) {
            x = newValue
          },
        }
      }
    });
    expect(x).toBe(15);
    expect(result).toBe(15);
  });
});