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
        // todo
        return new SValues.SStringValue(sThis.toString(), mProvider.newMetadataForRuntimeTimeEmergingValue());
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