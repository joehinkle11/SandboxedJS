import { SLocalSymbolTable } from "../SLocalSymbolTable";
import { sBuiltInFunctionPrototype } from "./ECMAScript/BuiltInFunctionPrototype";
import { sBuiltInNumberConstructor } from "./ECMAScript/BuiltInNumberConstructor";
import { sBuiltInObjectConstructor } from "./ECMAScript/BuiltInObjectConstructor";
import { sBuiltInObjectPrototype } from "./ECMAScript/BuiltInObjectPrototype";
import { InstallBuiltIn } from "./InstallBuiltIn";

export const installEcmaScript: InstallBuiltIn<any> = (sTable: SLocalSymbolTable<any>) => {
  sBuiltInObjectPrototype(sTable);
  sBuiltInFunctionPrototype(sTable);
  sBuiltInObjectConstructor(sTable);
  sBuiltInNumberConstructor(sTable);
}