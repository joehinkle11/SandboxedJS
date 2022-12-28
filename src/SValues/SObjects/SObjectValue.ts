import type { ECMA_PropertyDescriptor } from "../../ECMAModels/ECMA_PropertyDescriptor";
// import { ECMA_DefinePropertyOrThrow } from "../../ECMAProcesses/OperationsOnObjects/ECMA_DefinePropertyOrThrow";
// import { ECMA_OrdinaryDefineOwnProperty } from "../../ECMAProcesses/OperationsOnObjects/ECMA_OrdinaryDefineOwnProperty";
import { ECMA_ToPropertyDescriptor } from "../../ECMAProcesses/SpecificationTypes/ECMA_ToPropertyDescriptor";
// import { hiddenSObjectStorageSymbol } from "../../HiddenSymbols";
import SUserError from "../../Models/SUserError";
import type { SLocalSymbolTable, SRootSymbolTable } from "../../SLocalSymbolTable";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { ValueMetadataSystem } from "../../TranspileContext";
import { SValues } from "../AllSValues";
import type { SBooleanValue } from "../SPrimitiveValues/SBooleanValue";
import type { SNumberValue } from "../SPrimitiveValues/SNumberValue";
import { SValue } from "../SValue";
import type { SReceiverOrTarget } from "../SValueDef";
import type { SBuiltInObjectKind, MapSBuiltInObjectKindToSObjectStorage, SObjectSwizzleAndWhiteList, BaseSObjectStorage, SPrototypeType, SPrototypeDeterminedType } from "./SObjectValueDef";
import { buildNativeJsValueForSObject, sGet, sGetOwn, sSet, sUnaryLogicalNot, sUnaryMakePositive, sUnaryNegate } from "./SObjectValueImpl";

export abstract class SObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SValue<M> {
  get sValueKind(): "s-object" { return "s-object" };
  metadata: M;
  readonly sStorage: S & object;
  sPrototype: SPrototypeType;
  get determinedSPrototype(): SPrototypeDeterminedType {
    if (typeof this.sPrototype === "function") {
      this.sPrototype = this.sPrototype();
    }
    return this.sPrototype;
  }

  exportNativeJsValueAsCopiedBuiltIn: boolean;

  private actualNativeJsValue: any | undefined = undefined;
  getNativeJsValue(rootSTable: SRootSymbolTable<M>): object {
    return this.actualNativeJsValue ?? (this.actualNativeJsValue = buildNativeJsValueForSObject<any, any>(this, this.sStorage, rootSTable));
  }
  get nativeJsValue(): any { return this.sStorage }

  /// https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.defineproperty
  sDefineProperty(propertyKey: string | symbol, attributes: SObjectValue<M, any, any>, sTable: SLocalSymbolTable<M>): this {
    // 1. If O is not an Object, throw a TypeError exception.
    // assumed.

    // 2. Let key be ? ToPropertyKey(P).
    // assumed.

    // 3. Let desc be ? ToPropertyDescriptor(Attributes).
    const propDesc: PropertyDescriptor = ECMA_ToPropertyDescriptor(attributes, sTable);

    // 4. Perform ? DefinePropertyOrThrow(O, key, desc).
    // ECMA_DefinePropertyOrThrow(this, propertyKey, propDesc, sTable);
    this.sDefineOwnPropertyOrThrowNative(propertyKey, propDesc, sTable);

    // 5. Return O.
    return this;
  }

  sDefineOwnPropertyOrThrowNative(p: string | symbol, desc: PropertyDescriptor, sTable: SLocalSymbolTable<any>): void {
    try {
      Object.defineProperty(this.sStorage, p, desc);
    } catch {
      throw SUserError.failedToSetPropertyOnObject;
    }
  }

  sHasNative(p: string | symbol): boolean {
    if (Reflect.has(this.sStorage, p)) {
      return true;
    } else if (this.determinedSPrototype instanceof SObjectValue) {
      return this.determinedSPrototype.sHasNative(p);
    } else {
      return false;
    }
  }
  sToBooleanNative(): boolean {
    return true;
  }

  constructor(sStorage: S & object, sPrototype: SPrototypeType, metadata: M, exportNativeJsValueAsCopiedBuiltIn: boolean) {
    super();
    this.metadata = metadata;
    Object.setPrototypeOf(sStorage, null);
    const weakSelf = new WeakRef(this);
    // (sStorage as any)[hiddenSObjectStorageSymbol] = {
    //   getSThis: () => {return weakSelf.deref()}
    // } as SObjectHiddenFromUserData;
    this.sStorage = sStorage;
    this.sPrototype = sPrototype;
    this.metadata = metadata;
    this.exportNativeJsValueAsCopiedBuiltIn = exportNativeJsValueAsCopiedBuiltIn;
  }

  sUnaryNegateInternal: ((self: SObjectValue<M, any, any>) => SValue<M>) | undefined = undefined;
  sUnaryMakePositiveInternal: ((self: SObjectValue<M, any, any>) => SValue<M>) | undefined = undefined;
  
  sConvertToObject(): this {
    return this;
  }
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

  sOwnKeysNative(): (string | symbol)[] {
    return Reflect.ownKeys(this.sStorage);
  }
  sSet:<T extends SValue<M>>(p: string | symbol, newValue: T, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>) => T = sSet;
  sGetOwn:(p: string | symbol, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>) => SValue<M> = sGetOwn;
  sGet:(p: string | symbol, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>) => SValue<M> = sGet;
  sGetNativeAsBoolean(p: string | symbol, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>): boolean {
    return this.sGet(p, receiver, sTable).sToBooleanNative();
  };
  // /// [[GetOwnProperty]]
  // sGetOwnPropertyNative(p: string | symbol, sTable: SLocalSymbolTable<any>): ECMA_PropertyDescriptor | undefined {
  //   return ECMA_OrdinaryGetOwnProperty(this, p, sTable);
  // }
}