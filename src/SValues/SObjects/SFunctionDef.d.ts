import type { SObjectProperties } from "./SObjectValueDef";
import type { SValue } from "../SValue";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";


export type SandboxedFunctionCall = (sThisArg: SValue<any>, sArgArray: SValue<any>[], sTable: SLocalSymbolTable<any>) => SValue<any>;
export type AnySFunction = SandboxedFunctionCall & SObjectProperties & UnknownFunction;
export type UnknownFunction = (...args: (any | unknown)[]) => unknown;