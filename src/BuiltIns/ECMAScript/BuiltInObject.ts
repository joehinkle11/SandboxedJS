import { SLocalSymbolTable } from "../../SLocalSymbolTable";
import { MaybeSValueMetadata } from "../../SValueMetadata";
import { SNormalObject } from "../../SValues";



export function sBuiltInObject<M extends MaybeSValueMetadata>(
  sTable: SLocalSymbolTable<M>
) {
  // const builtInObject: SNormalObject<M> = new SNormalObject<M>({
  //   asd: {

  //   }
  // }, sTable);
  // sTable.assign("Object", builtInObject);
}