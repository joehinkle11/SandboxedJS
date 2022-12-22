import type { SObjectProperties } from "./SObjectValueDef";
import type { SValue } from "../SValue";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SFunction } from "./SFunction";

export type AnySFunction = SandboxedFunctionCall & SObjectProperties & UnknownFunction;
export type SandboxedFunctionCall = (sThisArg: SValue<any> | undefined, sArgArray: SValue<any>[], newTarget: undefined, sTable: SLocalSymbolTable<any>) => SValue<any>;
export type SandboxedConstructorFunctionCall = new (sThisArg: undefined, sArgArray: SValue<any>[], newTarget: SFunction<any>, sTable: SLocalSymbolTable<any>) => SValue<any>;
export type SandboxedConstructorFunctionCallAsNormalCall = (sThisArg: undefined, sArgArray: SValue<any>[], newTarget: SFunction<any>, sTable: SLocalSymbolTable<any>) => SValue<any>;
export type UnknownFunction = (...args: (any | unknown)[]) => unknown;
export type UnknownConstructorFunction = new (...args: (any | unknown)[]) => unknown;