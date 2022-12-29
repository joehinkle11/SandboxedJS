import type { ECMA_PropertyDescriptor } from "../../ECMAModels/ECMA_PropertyDescriptor";
// import { ECMA_DefinePropertyOrThrow } from "../../ECMAProcesses/OperationsOnObjects/ECMA_DefinePropertyOrThrow";
// import { ECMA_OrdinaryDefineOwnProperty } from "../../ECMAProcesses/OperationsOnObjects/ECMA_OrdinaryDefineOwnProperty";
import { ECMA_ToPropertyDescriptor } from "../../ECMAProcesses/SpecificationTypes/ECMA_ToPropertyDescriptor";
// import { hiddenSObjectStorageSymbol } from "../../HiddenSymbols";
import SUserError from "../../Models/SUserError";
import type { SLocalSymbolTable, SRootSymbolTable } from "../../SLocalSymbolTable";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { ValueMetadataSystem } from "../../TranspileContext";
import type { SBigIntValue } from "../SPrimitiveValues/SBigIntValue";
import type { SBooleanValue } from "../SPrimitiveValues/SBooleanValue";
import type { SNumberValue } from "../SPrimitiveValues/SNumberValue";
import type { SStringValue } from "../SPrimitiveValues/SStringValue";
import type { SSymbolValue } from "../SPrimitiveValues/SSymbolValue";
import { SValue } from "../SValue";
import type { SReceiverOrTarget } from "../SValueDef";
import type { SBuiltInObjectKind, MapSBuiltInObjectKindToSObjectStorage, SObjectSwizzleAndWhiteList, BaseSObjectStorage, SPrototypeType, SPrototypeDeterminedType } from "./SObjectValueDef";
import { buildNativeJsValueForSObject, sGet, sGetOwn, sSet, sUnaryLogicalNot, sUnaryMakePositive, sUnaryNegate } from "./SObjectValueImpl";

export abstract class SObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SValue<M> {
  get sValueKind(): "s-object" { return "s-object" };
  metadata: M;

  abstract sPrototype: SPrototypeType;
  abstract determinedSPrototype: SPrototypeDeterminedType;
  abstract exportNativeJsValueAsCopiedBuiltIn: boolean;

  constructor(metadata: M) {
    super();
    this.metadata = metadata;
  }
  
  sToBooleanNative(): boolean {
    return true;
  }
  sIsTruthyNative(): boolean {
    return true;
  }

  abstract sUnaryNegateInternal: (() => SValue<M> | undefined) | undefined;
  abstract sUnaryMakePositiveInternal: (() => SValue<M> | undefined) | undefined;
  
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

  abstract sGetNativeAsBoolean(p: string | symbol, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>): boolean;
  abstract sDefineOwnPropertyOrThrowNative(p: string | symbol, desc: PropertyDescriptor, sTable: SLocalSymbolTable<any>): void;
  abstract sDefineProperty(propertyKey: string | symbol, attributes: SObjectValue<M, any, any>, sTable: SLocalSymbolTable<M>): this;

  sConvertToBooleanPrimitive(): SBooleanValue<M, boolean> {
    throw new Error("todo object sConvertToBooleanPrimitive");
  }
  sConvertToBigIntPrimitive(): SBigIntValue<M, bigint> {
    throw new Error("todo object sConvertToBigIntPrimitive");
  }
  sConvertToStringPrimitive(): SStringValue<M, string> {
    throw new Error("todo object sConvertToStringPrimitive");
  }
  sConvertToNumberPrimitive(): SNumberValue<M, number> {
    throw new Error("todo object sConvertToNumberPrimitive");
  }
  sConvertToSymbolPrimitive(): SSymbolValue<M, symbol> {
    throw new Error("todo object sConvertToSymbolPrimitive");
  }
}