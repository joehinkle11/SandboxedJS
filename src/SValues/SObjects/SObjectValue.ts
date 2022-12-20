import type { SandboxedJSRunner } from "../../Runner";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SBooleanValue } from "../SPrimitiveValues/SBooleanValue";
import type { SNullValue } from "../SPrimitiveValues/SNullValue";
import type { SNumberValue } from "../SPrimitiveValues/SNumberValue";
import { SValue } from "../SValue";
import type { SBuiltInObjectKind, MapSBuiltInObjectKindToSObjectStorage, SObjectSwizzleAndWhiteList, BaseSObjectStorage } from "./SObjectValueDef";
import { buildNativeJsValueForSObject, sGet, sUnaryLogicalNot, sUnaryMakePositive, sUnaryNegate } from "./SObjectValueImpl";


export abstract class SObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SValue<M> {
  get sValueKind(): "s-object" { return "s-object" };
  readonly sPrototype: SObjectValue<M, any, any> | SNullValue<M>;
  readonly sStorage: S & object;
  metadata: M;
  exportNativeJsValueAsCopiedBuiltIn: boolean;

  #actualNativeJsValue: any | undefined;
  getNativeJsValue(runner: SandboxedJSRunner<M>): object {
    return this.#actualNativeJsValue ?? (this.#actualNativeJsValue = buildNativeJsValueForSObject<any, any>(this, this.sStorage, runner));
  }

  constructor(sStorage: S & object, sPrototype: SObjectValue<M, any, any> | SNullValue<M>, metadata: M, exportNativeJsValueAsCopiedBuiltIn: boolean) {
    super();
    Object.setPrototypeOf(sStorage, null);
    this.sStorage = sStorage;
    this.sPrototype = sPrototype;
    this.metadata = metadata;
    this.exportNativeJsValueAsCopiedBuiltIn = exportNativeJsValueAsCopiedBuiltIn;
  }
  sOwnKeysNative(): (string | symbol)[] {
    return Reflect.ownKeys(this.sStorage);
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
  sUnaryNegate: () => SNumberValue<M, typeof NaN> = sUnaryNegate;
  sUnaryMakePositive: () => SNumberValue<M, typeof NaN> = sUnaryMakePositive;
  sUnaryLogicalNot: () => SBooleanValue<M, false> = sUnaryLogicalNot;
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): RSValue {
    return getRight().addingMetadata(this, mProvider);
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this {
    return this;
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    this.metadata = mProvider.valueMetadataSystem.newMetadataForCombiningValues(this, anotherValue)
    return this;
  }
}