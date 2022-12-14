
// Everything passes through this object, is used to make it possible to add metadata
// to a reference to an object without effecting the metadata on other references to
import type { SLocalSymbolTable, SRootSymbolTable } from "../../SLocalSymbolTable";
import type { SValueMetadata } from "../../SValueMetadata";
import { SValue } from "../SValue";
import type { SReceiverOrTarget, SValueKind } from "../SValueDef";
import type { SBooleanValue } from "../SPrimitiveValues/SBooleanValue";
import type { SObjectValue } from "./SObjectValue";
import type { SBuiltInObjectKind, MapSBuiltInObjectKindToSObjectStorage } from "./SObjectValueDef";
import { sUnaryNegate, sUnaryMakePositive, sUnaryLogicalNot } from "./SReferencedObjectValueImpl";
import type { ECMA_PropertyDescriptor } from "../../ECMAModels/ECMA_PropertyDescriptor";
import { SBigIntValue } from "../SPrimitiveValues/SBigIntValue";
import { SNumberValue } from "../SPrimitiveValues/SNumberValue";
import { SStringValue } from "../SPrimitiveValues/SStringValue";
import { SSymbolValue } from "../SPrimitiveValues/SSymbolValue";

// the same object.
export class SReferencedObjectValue<M extends SValueMetadata, K extends SBuiltInObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SValue<M> {

  wrappedObject: SObjectValue<M, K, S>

  addedMetadata: M;
  getNativeJsValue(rootSTable: SRootSymbolTable<M>): any {
    return this.wrappedObject.getNativeJsValue(rootSTable);
  }
  get metadata(): M {
    return this.wrappedObject.metadata.mixWithReferencedMetadata(this.addedMetadata) as M;
  }
  // sDefineOwnPropertyNative(p: string | symbol, desc: ECMA_PropertyDescriptor, sTable: SLocalSymbolTable<any>): boolean {
  //   return this.wrappedObject.sDefineOwnPropertyNative(p, desc, sTable);
  // }
  sIsTruthyNative(): boolean {
    return this.wrappedObject.sIsTruthyNative();
  }
  sHasNative(p: string | symbol): boolean {
    return this.wrappedObject.sHasNative(p);
  }
  sToBooleanNative(): boolean {
    return this.wrappedObject.sToBooleanNative();
  }
  sConvertToObject(sTable: SLocalSymbolTable<M>): SObjectValue<M, any, any> {
    return this.wrappedObject.sConvertToObject();
  }
  sOwnKeysNative(): (string | symbol)[] {
    throw new Error("Method not implemented.");
  }
  sApply(): never {
    throw Error("todo sApply on SReferencedObjectValue")
  }
  sConstruct(): never {
    throw Error("todo sConstruct on SReferencedObjectValue")
  }

  constructor(wrappedObject: SObjectValue<M, K, S>, addedMetadata: M) {
    super();
    this.wrappedObject = wrappedObject;
    this.addedMetadata = addedMetadata;
  }

  get sValueKind(): SValueKind {
    throw new Error("Method not implemented.");
  }
  sUnaryTypeOfAsNative(): "object" | "function" {
    return this.wrappedObject.sUnaryTypeOfAsNative();
  }
  sUnaryNegate: () => SValue<M> = sUnaryNegate;
  sUnaryMakePositive: () => SValue<M> = sUnaryMakePositive;
  sUnaryLogicalNot: () => SBooleanValue<M, boolean> = sUnaryLogicalNot;
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): RSValue {
    return getRight().addingMetadata(this, sTable);
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this {
    return this;
  }
  sChainExpression(p: string | symbol, sTable: SLocalSymbolTable<M>): SValue<M> {
    // todo: add proper metadata
    return this.wrappedObject.sChainExpression(p, sTable);
  }
  sGet(p: string | symbol, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>): SValue<M> {
    // todo: add proper metadata
    return this.wrappedObject.sGet(p, receiver, sTable);
  }
  sSet<T extends SValue<M>>(p: string | symbol, newValue: T, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>): T {
    // todo: add proper metadata
    return this.wrappedObject.sSet(p, newValue, receiver, sTable);
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    throw new Error("Method not implemented.");
  }

  sConvertToBooleanPrimitive(): SBooleanValue<M, boolean> {
    return this.wrappedObject.sConvertToBooleanPrimitive();
  }
  sConvertToBigIntPrimitive(): SBigIntValue<M, bigint> {
    return this.wrappedObject.sConvertToBigIntPrimitive();
  }
  sConvertToStringPrimitive(): SStringValue<M, string> {
    return this.wrappedObject.sConvertToStringPrimitive();
  }
  sConvertToNumberPrimitive(): SNumberValue<M, number> {
    return this.wrappedObject.sConvertToNumberPrimitive();
  }
  sConvertToSymbolPrimitive(): SSymbolValue<M, symbol> {
    return this.wrappedObject.sConvertToSymbolPrimitive();
  }
}
