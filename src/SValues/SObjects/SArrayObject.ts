import type { SLocalSymbolTable, SRootSymbolTable } from "../../SLocalSymbolTable";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../AllSValues";
import type { SValue } from "../SValue";
import type { SProxiedNativeArray } from "./SArrayObjectDef";
import { createProxiedNativeArray } from "./SArrayObjectImpl";
import { SNonFunctionObjectValue } from "./SNonFunctionObjectValue";
import type { SPrototypeType } from "./SObjectValueDef";

export class SArrayObject<M extends MaybeSValueMetadata, E extends SValue<M>> extends SNonFunctionObjectValue<M, "array", SProxiedNativeArray<E, M>> {
  declare getNativeJsValue: (rootSTable: SRootSymbolTable<M>) => any[];
  declare readonly sStorage: SProxiedNativeArray<E, M>;

  private constructor(sStorage: SProxiedNativeArray<E, M>, sPrototype: SPrototypeType, metadata: M) {
    super(sStorage, sPrototype, metadata, false);
  }

  static createWithMetadata<M extends MaybeSValueMetadata, E extends SValue<M>>(
    array: E[],
    metadata: M,
    sTable: SLocalSymbolTable<M>
  ): SArrayObject<M, E> {
    const weakSArrayObject: {weakRef?: WeakRef<SArrayObject<M, E>>} = {};
    const proxiedArray = createProxiedNativeArray(array, weakSArrayObject);
    const sPrototype = sTable.sGlobalProtocols.ArrayProtocol;
    const sArrayObj = new SArrayObject<M, E>(proxiedArray, sPrototype, metadata);
    weakSArrayObject.weakRef = new WeakRef(sArrayObj);
    return sArrayObj;
  }

  static create<M extends MaybeSValueMetadata, E extends SValue<M>>(
    array: E[],
    sTable: SLocalSymbolTable<M>
  ): SArrayObject<M, E> {
    return this.createWithMetadata(array, sTable.newMetadataForObjectValue(), sTable);
  }

  // static createFromNative(
  //   nativeObject: any,
  //   sSwizzleAndWhiteList: SObjectSwizzleAndWhiteList<any>,
  //   sPrototype: SPrototypeType,
  //   metadata: MaybeSValueMetadata
  // ): SObjectValue<any, any, any>;
}
