import type { ECMA_PropertyDescriptor } from "../../ECMAModels/ECMA_PropertyDescriptor";
import SUserError from "../../Models/SUserError";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SObjectValue } from "../../SValues/SObjects/SObjectValue";
import type{ SValue } from "../../SValues/SValue";
import { ECMA_IsAccessorDescriptor } from "../SpecificationTypes/ECMA_IsAccessorDescriptor";
import { ECMA_IsDataDescriptor } from "../SpecificationTypes/ECMA_IsDataDescriptor";


/*
/// https://tc39.es/ecma262/#sec-validateandapplypropertydescriptor
export function ECMA_ValidateAndApplyPropertyDescriptor(
  O: SObjectValue<any, any, any>,
  P: string | symbol,
  extensible: boolean,
  Desc: ECMA_PropertyDescriptor,
  current: TypedPropertyDescriptor<any> | undefined,
  sTable: SLocalSymbolTable<any>
): boolean {
  // 1. Assert: IsPropertyKey(P) is true.
  // assumed.

  // 2. If current is undefined, then
  if (current === undefined) {
    // a. If extensible is false, return false.
    if (extensible === false) {
      return false;
    }

    // b. If O is undefined, return true.
    // assumed that O is never undefined here.

    // c. If IsAccessorDescriptor(Desc) is true, then
    if (ECMA_IsAccessorDescriptor(Desc)) {
      // i. Create an own accessor property named P of object O whose [[Get]], [[Set]], [[Enumerable]], and [[Configurable]] attributes are set to the value of the corresponding field in Desc if Desc has that field, or to the attribute's default value otherwise.
      throw new Error("todo i. Create an own accessor property")
    } else {
      // d. Else,
      // i. Create an own data property named P of object O whose [[Value]], [[Writable]], [[Enumerable]], and [[Configurable]] attributes are set to the value of the corresponding field in Desc if Desc has that field, or to the attribute's default value otherwise.
      throw new Error("todo i. Create an own data property")
    }

    // e. Return true.
    return true;
  }
  // 3. Assert: current is a fully populated Property Descriptor.
  // 4. If Desc does not have any fields, return true.

  // 5. If current.[[Configurable]] is false, then
  if (current.configurable !== true) {
    // a. If Desc has a [[Configurable]] field and Desc.[[Configurable]] is true, return false.
    // b. If Desc has an [[Enumerable]] field and SameValue(Desc.[[Enumerable]], current.[[Enumerable]]) is false, return false.
    // c. If IsGenericDescriptor(Desc) is false and SameValue(IsAccessorDescriptor(Desc), IsAccessorDescriptor(current)) is false, return false.
    // d. If IsAccessorDescriptor(current) is true, then
    // i. If Desc has a [[Get]] field and SameValue(Desc.[[Get]], current.[[Get]]) is false, return false.
    // ii. If Desc has a [[Set]] field and SameValue(Desc.[[Set]], current.[[Set]]) is false, return false.
    // e. Else if current.[[Writable]] is false, then
    // i. If Desc has a [[Writable]] field and Desc.[[Writable]] is true, return false.
    // ii. If Desc has a [[Value]] field and SameValue(Desc.[[Value]], current.[[Value]]) is false, return false.
  }

  // 6. If O is not undefined, then
  // assumed.

  // a. If IsDataDescriptor(current) is true and IsAccessorDescriptor(Desc) is true, then
  if (ECMA_IsDataDescriptor(current) && ECMA_IsAccessorDescriptor(Desc)) {
    // i. If Desc has a [[Configurable]] field, let configurable be Desc.[[Configurable]]; else let configurable be current.[[Configurable]].
    // ii. If Desc has a [[Enumerable]] field, let enumerable be Desc.[[Enumerable]]; else let enumerable be current.[[Enumerable]].
    // iii. Replace the property named P of object O with an accessor property whose [[Configurable]] and [[Enumerable]] attributes are set to configurable and enumerable, respectively, and whose [[Get]] and [[Set]] attributes are set to the value of the corresponding field in Desc if Desc has that field, or to the attribute's default value otherwise.
    // b. Else if IsAccessorDescriptor(current) is true and IsDataDescriptor(Desc) is true, then
  } else if (ECMA_IsAccessorDescriptor(current) && ECMA_IsDataDescriptor(Desc)) {
    // i. If Desc has a [[Configurable]] field, let configurable be Desc.[[Configurable]]; else let configurable be current.[[Configurable]].
    // ii. If Desc has a [[Enumerable]] field, let enumerable be Desc.[[Enumerable]]; else let enumerable be current.[[Enumerable]].
    // iii. Replace the property named P of object O with a data property whose [[Configurable]] and [[Enumerable]] attributes are set to configurable and enumerable, respectively, and whose [[Value]] and [[Writable]] attributes are set to the value of the corresponding field in Desc if Desc has that field, or to the attribute's default value otherwise.
    // c. Else,
  } else {
    // i. For each field of Desc, set the corresponding attribute of the property named P of object O to the value of the field.
  }

  // 7. Return true.
  return true;
}
*/