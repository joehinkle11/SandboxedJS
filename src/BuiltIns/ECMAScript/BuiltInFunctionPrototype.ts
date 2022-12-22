import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../../SValues/AllSValues";
import type { SValue } from "../../SValues/SValue";

// export function sBuiltInFunctionPrototype<M extends MaybeSValueMetadata>(
//   sTable: SLocalSymbolTable<M>
// ) {
//   const s_bind = SValues.SFunction.createFromNative(
//     Function.prototype.bind,
//     {
//       swizzled_apply_raw(sThis, sArgs, mProvider) {
//         const thingToBind = sArgs[0];
//         if (sThis instanceof SValues.SFunction) {
//           const sFuncToCall = sThis;
//           return SValues.SFunction.create((sThisArg: SValue<any>, sArgArray: SValue<any>[], sTable: SLocalSymbolTable<any>) => {
//             return sFuncToCall.sApply(thingToBind, sArgs, sTable);
//           }, sThis.functionAsString, mProvider);
//         }
//         throw new Error("Err expected function here")
//       },
//     },
//     () => sTable.sGlobalProtocols.FunctionProtocol,
//     sTable.newMetadataForCompileTimeLiteral()
//   );
//   sTable.sGlobalProtocols.FunctionProtocol = SValues.SNormalObject.createFromNative(
//     Function.prototype,
//     {
//       whitelist_name: true,
//       swizzle_static_bind: s_bind
//     },
//     () => sTable.sGlobalProtocols.ObjectProtocol,
//     sTable.newMetadataForCompileTimeLiteral()
//   );
// }