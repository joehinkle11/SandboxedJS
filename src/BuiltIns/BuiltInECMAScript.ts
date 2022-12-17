import { SLocalSymbolTable } from "../SLocalSymbolTable";
import { sBuiltInObject } from "./ECMAScript/BuiltInObjectConstructor";
import { InstallBuiltIn } from "./InstallBuiltIn";



export const installEcmaScript: InstallBuiltIn<any> = (sTable: SLocalSymbolTable<any>) => {
  sBuiltInObject(sTable);
}