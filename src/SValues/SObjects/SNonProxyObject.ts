import { ECMA_ToPropertyDescriptor } from "../../ECMAProcesses/SpecificationTypes/ECMA_ToPropertyDescriptor";
import SUserError from "../../Models/SUserError";
import type { SLocalSymbolTable, SRootSymbolTable } from "../../SLocalSymbolTable";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SValue } from "../SValue";
import type { SReceiverOrTarget } from "../SValueDef";
import { SObjectValue } from "./SObjectValue";
import type { MapSBuiltInObjectKindToSObjectStorage, SBuiltInObjectKind, SPrototypeDeterminedType, SPrototypeType } from "./SObjectValueDef";
import { buildNativeJsValueForSObject, sSet, sGetOwn, sGet } from "./SObjectValueImpl";

export abstract class SNonProxyObject<M extends MaybeSValueMetadata, K extends SBuiltInObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SObjectValue<M, K, S> {

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



  constructor(sStorage: S & object, sPrototype: SPrototypeType, metadata: M, exportNativeJsValueAsCopiedBuiltIn: boolean) {
    super(metadata);
    Object.setPrototypeOf(sStorage, null);
    this.sStorage = sStorage;
    this.sPrototype = sPrototype;
    this.exportNativeJsValueAsCopiedBuiltIn = exportNativeJsValueAsCopiedBuiltIn;
  }


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


  sUnaryNegateInternal: (() => SValue<M>)  | undefined| undefined = undefined;
  sUnaryMakePositiveInternal: (() => SValue<M> | undefined) | undefined = undefined;
}