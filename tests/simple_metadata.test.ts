
import {describe, expect, test} from '@jest/globals';
import { SandboxedJSRunner } from '../src/Runner';
import { SValueMetadata } from '../src/SValueMetadata';


const sandboxedJSRunnerWithoutMetadataSystem = SandboxedJSRunner.newRunnerWithoutMetadata();

class Metadata implements SValueMetadata {

  data: string;

  constructor(data: string) {
    this.data = data;
  }
  
  mixWithReferencedMetadata(metadataOnReference: Metadata): Metadata {
    return new Metadata(this.data + " " + metadataOnReference.data);
  }
}

const sandboxedJSRunnerWithMetadataSystem = SandboxedJSRunner.newRunnerWithMetadata({
  newMetadataForCompileTimeLiteral() {
    return new Metadata("compile-time");
  },
  newMetadataForCombiningValues(left, right) {
    return new Metadata("runtime");
  },
  newMetadataForRuntimeTimeEmergingValue() {
    return new Metadata("runtime");
  },
  newMetadataForObjectValue() {
    return new Metadata("object");
  },
  newMetadataGlobalSymbolTable() {
    return new Metadata("");
  }
});

describe('no metadata when no metadata system given', () => {
  test('bool has no metadata', () => {
    expect(sandboxedJSRunnerWithoutMetadataSystem.evalJs("false", {returnNativeJSValue: false}).metadata).toBe(undefined);
  });
  test('number has no metadata', () => {
    expect(sandboxedJSRunnerWithoutMetadataSystem.evalJs("1", {returnNativeJSValue: false}).metadata).toBe(undefined);
  });
  test('adding numbers has no metadata', () => {
    expect(sandboxedJSRunnerWithoutMetadataSystem.evalJs("1 + 3", {returnNativeJSValue: false}).metadata).toBe(undefined);
  });
});

describe('basic metadata checks from compile-time code', () => {
  test('compile time value metadata', () => {
    expect(sandboxedJSRunnerWithMetadataSystem.evalJs("false", {returnNativeJSValue: false}).metadata.data).toBe("compile-time");
  });
  test('compile time value after unary op has compile time metadata', () => {
    expect(sandboxedJSRunnerWithMetadataSystem.evalJs("-1", {returnNativeJSValue: false}).metadata.data).toBe("compile-time");
  });
  test('compile time value after many unary ops has compile time metadata', () => {
    expect(sandboxedJSRunnerWithMetadataSystem.evalJs("-+-+-+-5.4", {returnNativeJSValue: false}).metadata.data).toBe("compile-time");
  });
  test('adding numbers shows it triggers runtime metadata function', () => {
    expect(sandboxedJSRunnerWithMetadataSystem.evalJs("1 + 3", {returnNativeJSValue: false}).metadata.data).toBe("runtime");
  });
});
