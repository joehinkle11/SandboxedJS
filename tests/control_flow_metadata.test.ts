
import {describe, expect, test} from '@jest/globals';
import { SandboxedJSRunner } from '../src/Runner';
import { SValueMetadata } from '../src/SValueMetadata';

class Metadata implements SValueMetadata {

  data1: Set<string>;
  data2: Set<string>;
  data3: Set<string>;

  constructor(data1: Set<string> = new Set(), data2: Set<string> = new Set(), data3: Set<string> = new Set()) {
    this.data1 = data1;
    this.data2 = data2;
    this.data3 = data3;
  }
  
  mixWithReferencedMetadata(metadataOnReference: Metadata): Metadata {
    return new Metadata(
      union(metadataOnReference.data1, this.data1),
      union(metadataOnReference.data2, this.data2),
      union(metadataOnReference.data3, this.data3)
    );
  }
}
function union<T>(...iterables: Set<T>[]): Set<T> {
  const set: Set<T> = new Set();

  for (const iterable of iterables) {
    for (const item of iterable) {
      set.add(item);
    }
  }

  return set;
}

const runner = SandboxedJSRunner.newRunnerWithMetadata<Metadata>({
  newMetadataForCompileTimeLiteral(currentScopeMetadata) {
    return new Metadata(new Set(["compile-time"])).mixWithReferencedMetadata(currentScopeMetadata);
  },
  newMetadataForCombiningValues(left, right) {
    return new Metadata(new Set(["runtime"]));
  },
  newMetadataForRuntimeTimeEmergingValue() {
    return new Metadata(new Set(["runtime"]));
  },
  newMetadataForObjectValue() {
    return new Metadata(new Set(["object"]));
  },
  newMetadataGlobalSymbolTable() {
    return new Metadata(new Set(), new Set(["new-context"]));
  }
});

describe('control flow metadata', () => {
  test('simple value', () => {
    const m = runner.evalJs("false", {returnNativeJSValue: false}).metadata;
    expect(m.data1.toString()).toBe(new Set(["compile-time"]).toString());
    expect(m.data2.toString()).toBe(new Set(["new-context"]).toString());
  });
});