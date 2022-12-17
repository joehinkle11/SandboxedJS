import SUserError from "../../Models/SUserError";
import { SLocalSymbolTable } from "../../SLocalSymbolTable";
import { MaybeSValueMetadata } from "../../SValueMetadata";
import { SFunction } from "../../SValues/SObjects/SFunction";



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
  );
  const s_toString = SFunction.createFromNative(
    Object.toString,
    {
      swizzled_apply_raw(sThis, sArgs, mProvider) {
        if (sArgs.length === 0) {
          throw SUserError.cannotConvertToObject;
        }
        return sArgs[0].sOwnKeys();
      },
    },
    sTable.newMetadataForCompileTimeLiteral()
  );
  sTable.assign("Object", SFunction.createFromNative(
    Object as ObjectConstructor & Function,
    {
      swizzle_static_getOwnPropertyNames: s_getOwnPropertyNames,
      swizzle_static_toString: s_toString,
      whitelist_name: true,
      whitelist_length: true,
      swizzled_apply_proxied(...args) {
        
      },
    },
    sTable.newMetadataForCompileTimeLiteral()
  ), "const");
}