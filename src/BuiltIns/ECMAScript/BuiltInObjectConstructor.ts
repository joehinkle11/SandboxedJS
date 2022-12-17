import SUserError from "../../Models/SUserError";
import { SLocalSymbolTable } from "../../SLocalSymbolTable";
import { MaybeSValueMetadata } from "../../SValueMetadata";
import { SBooleanValue, SFunction, SObjectValue, SUndefinedValue } from "../../SValues";



export function sBuiltInObject<M extends MaybeSValueMetadata>(
  sTable: SLocalSymbolTable<M>
) {
  const s_getOwnPropertyNames = SFunction.createFromNative(
    Object.getOwnPropertyNames,
    {
      swizzled_apply_raw(sThis, sArgs, mProvider) {
        if (sArgs.length === 0) {
          throw SUserError.cannotConvertToObject;
        }
        return sArgs[0].sOwnKeys();
      },
    },
    sTable.newMetadataForCompileTimeLiteral()
  )
  sTable.assign("Object", SFunction.createFromNative(
    Object as ObjectConstructor & Function,
    {
      swizzle_static_getOwnPropertyNames: s_getOwnPropertyNames,
      whitelist_name: true,
      whitelist_length: true,
      swizzled_apply_proxied(...args) {
        
      },
    },
    sTable.newMetadataForCompileTimeLiteral()
  ), "const");
}