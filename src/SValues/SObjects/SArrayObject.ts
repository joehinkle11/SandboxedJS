import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValue } from "../SValue";
import type { SProxiedNativeArray } from "./SArrayObjectDef";
import { createProxiedNativeArray } from "./SArrayObjectImpl";
import { SNonFunctionObjectValue } from "./SNonFunctionObjectValue";

export class SArrayObject<M extends MaybeSValueMetadata, E extends SValue<M>> extends SNonFunctionObjectValue<M, "array", SProxiedNativeArray<E, M>> {
  get nativeJsValue(): any[] { return this.getNativeJsValue() }
  readonly sStorage: SProxiedNativeArray<E, M>;

  private constructor(sStorage: SProxiedNativeArray<E, M>, metadata: M) {
    super(undefined, metadata);
    this.sStorage = sStorage;
  }

  static createWithMetadata<M extends MaybeSValueMetadata, E extends SValue<M>>(
    array: E[],
    metadata: M
  ): SArrayObject<M, E> {
    const weakSArrayObject: {weakRef?: WeakRef<SArrayObject<M, E>>} = {};
    const proxiedArray = createProxiedNativeArray(array, weakSArrayObject);
    const sArrayObj = new SArrayObject<M, E>(proxiedArray, metadata);
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
