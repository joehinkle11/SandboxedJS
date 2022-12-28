import type { ECMA_PropertyDescriptor } from "../../ECMAModels/ECMA_PropertyDescriptor";
import SUserError from "../../Models/SUserError";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SObjectValue } from "../../SValues/SObjects/SObjectValue";



// /**
//  * reference: https://tc39.es/ecma262/#sec-ordinarydefineownproperty
//  * 
//  * @throws TypeError
//  */
// export function ECMA_OrdinaryGetOwnProperty(
//   O: SObjectValue<any, any, any>,
//   P: string | symbol,
//   sTable: SLocalSymbolTable<any>
// ): ECMA_PropertyDescriptor | undefined {
//   const nativePropDescriptor = Reflect.getOwnPropertyDescriptor(O, P);
//   if (nativePropDescriptor === undefined) {
//     return undefined;
//   }
//   return {
//     __Get__: undefined, //nativePropDescriptor.get,
//     __Set__: undefined, //nativePropDescriptor.set,
  
//     // data
//     __Value__: nativePropDescriptor.value,
//     __Writable__: nativePropDescriptor.writable,
  
//     // shared
//     __Enumerable__: nativePropDescriptor.enumerable ?? false,
//     __Configurable__: nativePropDescriptor.configurable ?? false,

//   };
// }