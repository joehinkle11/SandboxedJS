import SUserError from "../../Models/SUserError";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../../SValues/AllSValues";
import type { SNumberValue } from "../../SValues/SPrimitiveValues/SNumberValue";

// export function sBuiltInObjectPrototype<M extends MaybeSValueMetadata>(
//   sTable: SLocalSymbolTable<M>
// ) {
//   const s_toString = SValues.SFunction.createFromNative(
//     Object.prototype.toString,
//     {
//       swizzled_apply_raw(sThis, sArgs, mProvider) {
//         let result: string;
//         if (sThis instanceof SValues.SPrimitiveValue) {
//           result = Object.prototype.toString.bind(sThis.nativeJsValue)();
//         } else if (sThis instanceof SValues.SObjectValue) {
//           result = Object.prototype.toString.bind(sThis.sStorage)();
//         } else {
//           throw new Error("Expect s-value in swizzled_apply_raw of Object.prototype.toString, not " + sThis + " | " + typeof sThis)
//         }
//         return new SValues.SStringValue(result, mProvider.newMetadataForRuntimeTimeEmergingValue());
//       },
//     },
//     () => sTable.sGlobalProtocols.FunctionProtocol,
//     sTable.newMetadataForCompileTimeLiteral()
//   );
//   sTable.sGlobalProtocols.ObjectProtocol = SValues.SNormalObject.createFromNative(
//     Object.prototype,
//     {
//       swizzle_static_toString: s_toString,
//       // whitelist_hasOwnProperty: true
//     },
//     new SValues.SNullValue(sTable.newMetadataForCompileTimeLiteral()),
//     sTable.newMetadataForCompileTimeLiteral()
//   );
//   sTable.sGlobalProtocols.ObjectProtocol.sUnaryMakePositiveInternal = (self) => {
//     return new SValues.SNumberValue(NaN, self.metadata);
//   }
//   sTable.sGlobalProtocols.ObjectProtocol.sUnaryNegateInternal = (self) => {
//     return new SValues.SNumberValue(NaN, self.metadata);
//   }
// }