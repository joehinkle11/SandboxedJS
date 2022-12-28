/*
import type { ECMA_PropertyDescriptor } from "../../ECMAModels/ECMA_PropertyDescriptor";
import SUserError from "../../Models/SUserError";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SObjectValue } from "../../SValues/SObjects/SObjectValue";
import { ECMA_ValidateAndApplyPropertyDescriptor } from "./ECMA_ValidateAndApplyPropertyDescriptor";
*/


/**
 * reference: https://tc39.es/ecma262/#sec-ordinarydefineownproperty
 * 
 * @throws TypeError
 */
/*
export function ECMA_OrdinaryDefineOwnProperty(
  O: SObjectValue<any, any, any>,
  P: string | symbol,
  desc: ECMA_PropertyDescriptor,
  sTable: SLocalSymbolTable<any>
): boolean {
  // 1. Let current be ? O.[[GetOwnProperty]](P).
  // const current: ECMA_PropertyDescriptor | undefined = O.sGetOwnPropertyNative(P, sTable);
  const current: TypedPropertyDescriptor<any> | undefined = Reflect.getOwnPropertyDescriptor(O, P)

  // 2. Let extensible be ? IsExtensible(O).
  const extensible = Reflect.isExtensible(O.sStorage);

  // 3. Return ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current).// 3. Return unused.
  return ECMA_ValidateAndApplyPropertyDescriptor(O, P, extensible, desc, current, sTable);
}
*/