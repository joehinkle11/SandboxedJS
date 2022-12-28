// import type { ECMA_PropertyDescriptor } from "../../ECMAModels/ECMA_PropertyDescriptor";
// import SUserError from "../../Models/SUserError";
// import type { SObjectValue } from "../../SValues/SObjects/SObjectValue";
// import type { SLocalSymbolTable } from "../../SLocalSymbolTable";


/**
 * reference: https://tc39.es/ecma262/multipage/abstract-operations.html#sec-definepropertyorthrow
 * 
 * @throws TypeError
 */
/*
export function ECMA_DefinePropertyOrThrow(
  O: SObjectValue<any, any, any>,
  P: string | symbol,
  desc: ECMA_PropertyDescriptor,
  sTable: SLocalSymbolTable<any>
): void {
  // 1. Let success be ? O.[[DefineOwnProperty]](P, desc).
  const success = O.sDefineOwnPropertyNative(P, desc, sTable);

  // 2. If success is false, throw a TypeError exception.
  if (success === false) {
    throw SUserError.cannotConvertToObject;
  }

  // 3. Return unused.
  return;
}
*/