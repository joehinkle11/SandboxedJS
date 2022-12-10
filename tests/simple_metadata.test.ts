
import {describe, expect, test} from '@jest/globals';
import { SandboxedJSRunner } from '../src/Runner';


const sandboxedJSRunnerWithoutMetadataSystem = SandboxedJSRunner.newRunnerWithoutMetadata();

const sandboxedJSRunnerWithMetadataSystem = SandboxedJSRunner.newRunnerWithMetadata({
  newMetadataForCompileTimeLiteral() {
    return {
      data: "compile-time"
    }
  },
  newMetadataForBinaryOperation(left, right) {
    return {
      data: "runtime"
    }
  },
});

describe('no metadata when no metadata system given', () => {
  test('bool has no metadata', () => {
    expect(sandboxedJSRunnerWithoutMetadataSystem.evalJs("false").metadata).toBe(undefined);
  });
  test('number has no metadata', () => {
    expect(sandboxedJSRunnerWithoutMetadataSystem.evalJs("1").metadata).toBe(undefined);
  });
  test('adding numbers has no metadata', () => {
    expect(sandboxedJSRunnerWithoutMetadataSystem.evalJs("1 + 3").metadata).toBe(undefined);
  });
});

describe('basic metadata checks from compile-time code', () => {
  test('compile time value metadata', () => {
    expect(sandboxedJSRunnerWithMetadataSystem.evalJs("false").metadata.data).toBe("compile-time");
  });
  test('compile time value after unary op has compile time metadata', () => {
    expect(sandboxedJSRunnerWithMetadataSystem.evalJs("-1").metadata.data).toBe("compile-time");
  });
  test('compile time value after many unary ops has compile time metadata', () => {
    expect(sandboxedJSRunnerWithMetadataSystem.evalJs("-+-+-+-5.4").metadata.data).toBe("compile-time");
  });
  test('adding numbers shows it triggers runtime metadata function', () => {
    expect(sandboxedJSRunnerWithMetadataSystem.evalJs("1 + 3").metadata.data).toBe("runtime");
  });
});
