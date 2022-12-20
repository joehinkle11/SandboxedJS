import SUserError from "../../Models/SUserError";
import { SLocalSymbolTable } from "../../SLocalSymbolTable";
import { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../../SValues/AllSValues";

export function sBuiltInObjectPrototype<M extends MaybeSValueMetadata>(
  sTable: SLocalSymbolTable<M>
) {
  const s_toString = SValues.SFunction.createFromNative(
    Object.prototype.toString,
    {
      swizzled_apply_raw(sThis, sArgs, mProvider) {
        let result: string;
        if (sThis instanceof SValues.SPrimitiveValue) {
          result = Object.prototype.toString.bind(sThis.nativeJsValue)();
        } else {
          // return Object.prototype.toString.bind(sThis.nativeJsValue)();
          result = "idkkk";
        }
        return new SValues.SStringValue(result, mProvider.newMetadataForRuntimeTimeEmergingValue());
      },
    },
    new SValues.SNullValue(sTable.newMetadataForCompileTimeLiteral()), // todo: change to function
    sTable.newMetadataForCompileTimeLiteral()
  );
  sTable.sGlobalProtocols.ObjectProtocol = SValues.SNormalObject.createFromNative(
    Object.prototype,
    {
      swizzle_static_toString: s_toString,
      // whitelist_hasOwnProperty: true
    },
    new SValues.SNullValue(sTable.newMetadataForCompileTimeLiteral()),
    sTable.newMetadataForCompileTimeLiteral()
  );
}