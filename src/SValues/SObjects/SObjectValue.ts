import type { SLocalSymbolTable, SRootSymbolTable } from "../../SLocalSymbolTable";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { ValueMetadataSystem } from "../../TranspileContext";
import type { SBooleanValue } from "../SPrimitiveValues/SBooleanValue";
import type { SNumberValue } from "../SPrimitiveValues/SNumberValue";
import { SValue } from "../SValue";
import type { SBuiltInObjectKind, MapSBuiltInObjectKindToSObjectStorage, SObjectSwizzleAndWhiteList, BaseSObjectStorage, SPrototypeType } from "./SObjectValueDef";
import { buildNativeJsValueForSObject, sGet, sUnaryLogicalNot, sUnaryMakePositive, sUnaryNegate } from "./SObjectValueImpl";


export abstract class SObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SValue<M> {
  get sValueKind(): "s-object" { return "s-object" };
  sPrototype: SPrototypeType;
  readonly sStorage: S & object;
  metadata: M;
  exportNativeJsValueAsCopiedBuiltIn: boolean;

  #actualNativeJsValue: any | undefined;
  getNativeJsValue(rootSTable: SRootSymbolTable<M>): object {
    return this.#actualNativeJsValue ?? (this.#actualNativeJsValue = buildNativeJsValueForSObject<any, any>(this, this.sStorage, rootSTable));
  }
  get nativeJsValue(): any { return this.sStorage }

  constructor(sStorage: S & object, sPrototype: SPrototypeType, metadata: M, exportNativeJsValueAsCopiedBuiltIn: boolean) {
    super();
    Object.setPrototypeOf(sStorage, null);
    this.sStorage = sStorage;
    this.sPrototype = sPrototype;
    this.metadata = metadata;
    this.exportNativeJsValueAsCopiedBuiltIn = exportNativeJsValueAsCopiedBuiltIn;
  }
  sUnaryNegateInternal: ((self: SObjectValue<M, any, any>) => SValue<M>) | undefined = undefined;
  sUnaryMakePositiveInternal: ((self: SObjectValue<M, any, any>) => SValue<M>) | undefined = undefined;
  sOwnKeysNative(): (string | symbol)[] {
    return Reflect.ownKeys(this.sStorage);
  }
  sConvertToObject(): this {
    return this;
  }
  sSet<T extends SValue<M>>(p: string | symbol, newValue: T, receiver: SValue<M>): T {
    (this.sStorage as Record<PropertyKey, SValue<any> | undefined>)[p] = newValue;
    return newValue;
  }
  sGet:(p: string | symbol, receiver: SValue<M>, sTable: SLocalSymbolTable<M>) => SValue<M> = sGet;
  sChainExpression(p: string | symbol, sTable: SLocalSymbolTable<M>): SValue<M> {
    return this.sGet(p, this, sTable);
  }
  abstract sUnaryTypeOfAsNative(): "object" | "function";
  sUnaryNegate: () => SValue<M> = sUnaryNegate;
  sUnaryMakePositive: () => SValue<M> = sUnaryMakePositive;
  sUnaryLogicalNot: () => SBooleanValue<M, false> = sUnaryLogicalNot;
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): RSValue {
    return getRight().addingMetadata(this, sTable);
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this {
    return this;
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    if (sTable.valueMetadataSystem === null) {
      return this;
    }
    this.metadata = (sTable.valueMetadataSystem as ValueMetadataSystem<any>).newMetadataForCombiningValues(this, anotherValue)
    return this;
  }
}

// interface SObjectValueSupportingCreationFromNative {
//   static createFromNative(
//     nativeObject: any,
//     sSwizzleAndWhiteList: SObjectSwizzleAndWhiteList<any>,
//     sPrototype: SPrototypeType,
//     metadata: MaybeSValueMetadata
//   ): SObjectValue<any, any, any>;
// }