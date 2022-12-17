import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SBooleanValue } from "../SPrimitiveValues/SBooleanValue";
import type { SNumberValue } from "../SPrimitiveValues/SNumberValue";
import { SValue } from "../SValue";
import type { SBuiltInObjectKind, MapSBuiltInObjectKindToSObjectStorage, SObjectSwizzleAndWhiteList } from "./SObjectValueDef";
import { buildNativeJsValueForSObject, sGet, sUnaryLogicalNot, sUnaryMakePositive, sUnaryNegate } from "./SObjectValueImpl";


export abstract class SObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SValue<M> {
  get sValueKind(): "s-object" { return "s-object" };
  abstract readonly sStorage: S & object;
  metadata: M;
  sSwizzleAndWhiteList: SObjectSwizzleAndWhiteList<S & any> | undefined;

  #actualNativeJsValue: any | undefined;
  getNativeJsValue(): any {
    return this.#actualNativeJsValue ?? (this.#actualNativeJsValue = buildNativeJsValueForSObject<any, any>(this, this.sStorage));
  }
  abstract readonly nativeJsValue: object;

  constructor(sSwizzleAndWhiteList: SObjectSwizzleAndWhiteList<S & any> | undefined, metadata: M) {
    super();
    this.sSwizzleAndWhiteList = sSwizzleAndWhiteList;
    this.metadata = metadata;
  }
  sOwnKeysNative(): (string | symbol)[] {
    if (this.sSwizzleAndWhiteList !== undefined) {
      throw Error("todo sOwnKeysNative on object with swizzle/whitelist") 
    }
    return Reflect.ownKeys(this.sStorage);
  }
  sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
  sGet:(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>) => SValue<M> = sGet;
  sChainExpression(p: string | symbol, mProvider: SMetadataProvider<M>): SValue<M> {
    return this.sGet(p, this, mProvider);
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