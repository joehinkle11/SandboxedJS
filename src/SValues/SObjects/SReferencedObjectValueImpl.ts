import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { MaybeSValueMetadata, SValueMetadata } from "../../SValueMetadata";
import { SBooleanValue } from "../SPrimitiveValues/SBooleanValue";
import { SNumberValue } from "../SPrimitiveValues/SNumberValue";
import { SPrimitiveValue } from "../SPrimitiveValues/SPrimitiveValue";
import type { SValue } from "../SValue";
import { SObjectValue } from "./SObjectValue";
import { SReferencedObjectValue } from "./SReferencedObjectValue";




export function sUnaryNegate<M extends SValueMetadata>(
  this: SReferencedObjectValue<M, any, any>
): SValue<M> {
  return new SNumberValue(NaN, this.metadata);
}
export function sUnaryMakePositive<M extends SValueMetadata>(
  this: SReferencedObjectValue<M, any, any>
): SValue<M> {
  return new SNumberValue(NaN, this.metadata);
}
export function sUnaryLogicalNot<M extends SValueMetadata>(
  this: SReferencedObjectValue<M, any, any>
): SBooleanValue<M, boolean> {
  return new SBooleanValue(false, this.metadata);
}


export function addMetadataToPropertyAccess<M extends MaybeSValueMetadata>(
  property: SValue<M>,
  sObject: SObjectValue<M, any, any>,
  sTable: SLocalSymbolTable<M>
): SReferencedObjectValue<any, any, any> | SPrimitiveValue<M, any> {
  if (property instanceof SPrimitiveValue || property instanceof SReferencedObjectValue) {
    return property.addingMetadata(sObject, sTable);
  } else if (property instanceof SObjectValue) {
    return new SReferencedObjectValue(property as SObjectValue<any, any, any>, sObject.metadata);
  } else {
    throw Error("Unknown property type in addMetadataToPropertyAccess.");
  }
}