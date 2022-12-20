import SUserError from "../../Models/SUserError";
import { SLocalSymbolTable } from "../../SLocalSymbolTable";
import { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../../SValues/AllSValues";

export function sBuiltInObjectConstructor<M extends MaybeSValueMetadata>(
  sTable: SLocalSymbolTable<M>
) {
  const s_getOwnPropertyNames = SValues.SFunction.createFromNative(
    Object.getOwnPropertyNames,
    {
      swizzled_apply_raw(sThis, sArgs, sTable) {
        if (sArgs.length === 0) {
          throw SUserError.cannotConvertToObject;
        }
        return sArgs[0].sOwnKeys(sTable);
      },
    },
    () => sTable.sGlobalProtocols.FunctionProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  );
  sTable.assign("Object", SValues.SFunction.createFromNative(
    Object as ObjectConstructor,
    {
      swizzle_static_getOwnPropertyNames: s_getOwnPropertyNames,
      // whitelist_name: true,
      // whitelist_length: true,
      // swizzled_apply_proxied(...args) {
      //   // todo
      // },
      swizzle_static_prototype: sTable.sGlobalProtocols.ObjectProtocol,
      swizzled_apply_raw() {
        throw new Error("todo swizzled_apply_raw for Object")
      }
    },
    new SValues.SNullValue(sTable.newMetadataForCompileTimeLiteral()), // todo: change to function
    sTable.newMetadataForCompileTimeLiteral()
  ), "const");
}