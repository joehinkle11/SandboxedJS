
// Everything passes through this object, is used to make it possible to add metadata
// to a reference to an object without effecting the metadata on other references to

import { SMetadataProvider } from "../SMetadataProvider";
import { SValueMetadata, MaybeSValueMetadata } from "../SValueMetadata";
import { SBuiltInObjectKind, SValue, SObjectValue, SValueKind, SNumberValue, SStringValue, JSTypeOfString, SBooleanValue, SPrimitiveValue, MapSBuiltInObjectKindToSObjectStorage } from "./SValues";

// the same object.
export class SReferencedObjectValue<M extends SValueMetadata, K extends SBuiltInObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SValue<M> {
  wrappedObject: SObjectValue<M, K, S>

  addedMetadata: M;
  get nativeJsValue(): object {
    return this.wrappedObject.nativeJsValue;
  }
  get metadata(): M {
    return this.wrappedObject.metadata.mixWithReferencedMetadata(this.addedMetadata) as M;
  }
  sOwnKeysNative(): (string | symbol)[] {
    throw new Error("Method not implemented.");
  }
  sApply(): never {
    throw Error("todo sApply on SReferencedObjectValue")
  }

  constructor(wrappedObject: SObjectValue<M, K, S>, addedMetadata: M) {
    super();
    this.wrappedObject = wrappedObject;
    this.addedMetadata = addedMetadata;
  }

  get sValueKind(): SValueKind {
    throw new Error("Method not implemented.");
  }
  sUnaryNegate(): SValue<M> {
    return new SNumberValue(NaN, this.metadata);
  }
  sUnaryMakePositive(): SValue<M> {
    return new SNumberValue(NaN, this.metadata);
  }
  sUnaryTypeOf(): SStringValue<M, JSTypeOfString> {
    const unaryTypeOf = this.wrappedObject.sUnaryTypeOf().nativeJsValue;
    return new SStringValue<M, JSTypeOfString>(unaryTypeOf, this.metadata);
  }
  sUnaryLogicalNot(): SBooleanValue<M, boolean> {
    return new SBooleanValue(false, this.metadata);
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): RSValue {
    return getRight().addingMetadata(this, mProvider);
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this {
    return this;
  }
  sChainExpression(p: string | symbol, mProvider: SMetadataProvider<M>): SValue<M> {
    // todo: add proper metadata
    return this.wrappedObject.sChainExpression(p, mProvider);
  }
  sGet(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>): SValue<M> {
    // todo: add proper metadata
    return this.wrappedObject.sGet(p, receiver, mProvider);
  }
  sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean> {
    // todo: add proper metadata
    return this.wrappedObject.sSet(p, newValue, receiver);
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    throw new Error("Method not implemented.");
  }
}


function addMetadataToPropertyAccess<M extends MaybeSValueMetadata>(
  property: SValue<M>,
  sObject: SObjectValue<M, any, any>,
  mProvider: SMetadataProvider<M>
): SReferencedObjectValue<any, any, any> | SPrimitiveValue<M, any> {
  if (property instanceof SPrimitiveValue || property instanceof SReferencedObjectValue) {
    return property.addingMetadata(sObject, mProvider);
  } else if (property instanceof SObjectValue) {
    return new SReferencedObjectValue(property as SObjectValue<any, any, any>, sObject.metadata);
  } else {
    throw Error("Unknown property type in addMetadataToPropertyAccess.");
  }
}