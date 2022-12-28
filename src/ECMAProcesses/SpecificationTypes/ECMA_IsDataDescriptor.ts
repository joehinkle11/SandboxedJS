import type { ECMA_PropertyDescriptor } from "../../ECMAModels/ECMA_PropertyDescriptor";

/// https://tc39.es/ecma262/#sec-isdatadescriptor
export function ECMA_IsDataDescriptor(
  Desc: ECMA_PropertyDescriptor | TypedPropertyDescriptor<any> | undefined
): boolean {
  // 1. If Desc is undefined, return false.
  if (Desc === undefined) {
    return false;
  }

  // 2. If Desc has a [[Value]] field, return true.
  if ("__Value__" in Desc || "value" in Desc) {
    return true;
  }

  // 3. If Desc has a [[Writable]] field, return true.
  if ("__Writable__" in Desc || "writable" in Desc) {
    return true;
  }

  // 4. Return false.
  return false;
}