import { SLocalSymbolTable } from "../../SLocalSymbolTable";
import { MaybeSValueMetadata } from "../../SValueMetadata";
import { SBooleanValue, SFunction, SUndefinedValue } from "../../SValues";



export function sBuiltInObject<M extends MaybeSValueMetadata>(
  sTable: SLocalSymbolTable<M>
) {
  const s_getOwnPropertyNames = SFunction.createFromNative(
    Object.getOwnPropertyNames,
    {},
    sTable.newMetadataForCompileTimeLiteral()
  )
  sTable.assign("Object", SFunction.createFromNative(
    Object as ObjectConstructor & Function,
    {
      swizzle_static_getOwnPropertyNames: s_getOwnPropertyNames,
      whitelist_name: true,
      whitelist_length: true,
    },
    sTable.newMetadataForCompileTimeLiteral()
  ), "const");
}