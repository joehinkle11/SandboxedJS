
// Everything passes through this object, is used to make it possible to add metadata
// to a reference to an object without effecting the metadata on other references to

import type { SMetadataProvider } from "../../SMetadataProvider";
import type { SValueMetadata } from "../../SValueMetadata";
import { SValue } from "../SValue";
import type { SValueKind } from "../SValueDef";
import type { SBooleanValue } from "../SPrimitiveValues/SBooleanValue";
import type { SObjectValue } from "./SObjectValue";
import type { SBuiltInObjectKind, MapSBuiltInObjectKindToSObjectStorage } from "./SObjectValueDef";
import { sUnaryNegate, sUnaryMakePositive, sUnaryLogicalNot } from "./SReferencedObjectValueImpl";

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
  sUnaryTypeOfAsNative(): "object" | "function" {
    return this.wrappedObject.sUnaryTypeOfAsNative();
  }
  sUnaryNegate: () => SValue<M> = sUnaryNegate;
  sUnaryMakePositive: () => SValue<M> = sUnaryMakePositive;
  sUnaryLogicalNot: () => SBooleanValue<M, boolean> = sUnaryLogicalNot;
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
