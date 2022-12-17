import { SLocalSymbolTable } from "../../SLocalSymbolTable";
import { MaybeSValueMetadata } from "../../SValueMetadata";
import { SFunction } from "../../SValues";



export function sBuiltInObject<M extends MaybeSValueMetadata>(
  sTable: SLocalSymbolTable<M>
) {
  sTable.assign("Object", SFunction.createFromNative(
    Object,
    {
      getOwnPropertyNames: true
    },
    sTable.newMetadataForCompileTimeLiteral()
  ), "const");
}