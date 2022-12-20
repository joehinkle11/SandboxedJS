import type { SandboxedJSRunner } from "../../Runner";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../AllSValues";
import type { SNullValue } from "../SPrimitiveValues/SNullValue";
import type { SValue } from "../SValue";
import type { SProxiedNativeArray } from "./SArrayObjectDef";
import { createProxiedNativeArray } from "./SArrayObjectImpl";
import { SNonFunctionObjectValue } from "./SNonFunctionObjectValue";
import { SObjectValue } from "./SObjectValue";

export class SArrayObject<M extends MaybeSValueMetadata, E extends SValue<M>> extends SNonFunctionObjectValue<M, "array", SProxiedNativeArray<E, M>> {
  declare getNativeJsValue: (runner: SandboxedJSRunner<M>) => any[];
  declare readonly sStorage: SProxiedNativeArray<E, M>;

  private constructor(sStorage: SProxiedNativeArray<E, M>, sPrototype: SObjectValue<M, any, any> | SNullValue<M>, metadata: M) {
    super(sStorage, sPrototype, metadata, false);
  }

  static createWithMetadata<M extends MaybeSValueMetadata, E extends SValue<M>>(
    array: E[],
    metadata: M
  ): SArrayObject<M, E> {
    const weakSArrayObject: {weakRef?: WeakRef<SArrayObject<M, E>>} = {};
    const proxiedArray = createProxiedNativeArray(array, weakSArrayObject);
    const sPrototype = new SValues.SNullValue(metadata); // todo: sPrototype
    const sArrayObj = new SArrayObject<M, E>(proxiedArray, sPrototype, metadata);
    weakSArrayObject.weakRef = new WeakRef(sArrayObj);
    return sArrayObj;
  }

  static create<M extends MaybeSValueMetadata, E extends SValue<M>>(
    array: E[],
    mProvider: SMetadataProvider<M>
  ): SArrayObject<M, E> {
    return this.createWithMetadata(array, mProvider.newMetadataForObjectValue());
  }
}
