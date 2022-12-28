import type { ECMA_PropertyDescriptor } from "../../ECMAModels/ECMA_PropertyDescriptor";

/// https://tc39.es/ecma262/#sec-isaccessordescriptor
export function ECMA_IsAccessorDescriptor(
  Desc: ECMA_PropertyDescriptor | TypedPropertyDescriptor<any> | undefined
): boolean {
  // 1. If Desc is undefined, return false.
  if (Desc === undefined) {
    return false;
  }

  // 2. If Desc has a [[Get]] field, return true.
  if ("__Get__" in Desc || "get" in Desc) {
    return true;
  }

  // 3. If Desc has a [[Set]] field, return true.
  if ("__Set__" in Desc || "set" in Desc) {
    return true;
  }

  // 4. Return false.
  return false;
}