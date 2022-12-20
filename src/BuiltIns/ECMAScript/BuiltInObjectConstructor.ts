import SUserError from "../../Models/SUserError";
import { SRootSymbolTable } from "../../SLocalSymbolTable";
import { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../../SValues/AllSValues";

export function sBuiltInObjectConstructor<M extends MaybeSValueMetadata>(
  rootSTable: SRootSymbolTable<M>
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
    () => rootSTable.sGlobalProtocols.FunctionProtocol,
    rootSTable.newMetadataForCompileTimeLiteral()
  );
  const s_is = SValues.SFunction.createFromNative(
    Object.is,
    {
      swizzled_apply_raw(sThis, sArgs, sTable) {
        if (sArgs.length === 0) {
          throw SUserError.cannotConvertToObject;
        }
        const r = Object.is(sArgs[0].getNativeJsValue(rootSTable), sArgs[1].getNativeJsValue(rootSTable));
        return new SValues.SBooleanValue(r, sArgs[0].combineMetadata(sArgs[1], sTable));
      },
    },
    () => rootSTable.sGlobalProtocols.FunctionProtocol,
    rootSTable.newMetadataForCompileTimeLiteral()
  );
  rootSTable.assign("Object", SValues.SFunction.createFromNative(
    Object as ObjectConstructor,
    {
      swizzle_static_getOwnPropertyNames: s_getOwnPropertyNames,
      swizzle_static_is: s_is,
      // whitelist_name: true,
      // whitelist_length: true,
      // swizzled_apply_proxied(...args) {
      //   // todo
      // },
      swizzle_static_prototype: rootSTable.sGlobalProtocols.ObjectProtocol,
      swizzled_apply_raw() {
        throw new Error("todo swizzled_apply_raw for Object")
      }
    },
    new SValues.SNullValue(rootSTable.newMetadataForCompileTimeLiteral()), // todo: change to function
    rootSTable.newMetadataForCompileTimeLiteral()
  ), "const");
}