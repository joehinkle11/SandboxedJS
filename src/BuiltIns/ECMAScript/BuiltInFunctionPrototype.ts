import { SLocalSymbolTable } from "../../SLocalSymbolTable";
import { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../../SValues/AllSValues";

export function sBuiltInFunctionPrototype<M extends MaybeSValueMetadata>(
  sTable: SLocalSymbolTable<M>
) {
  sTable.sGlobalProtocols.FunctionProtocol = SValues.SNormalObject.createFromNative(
    Function.prototype,
    {
      whitelist_name: true,
    },
    sTable.sGlobalProtocols.ObjectProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  );
}