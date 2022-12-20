import type { SObjectProperties } from "./SObjectValueDef";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { SValue } from "../SValue";


export type SandboxedFunctionCall = (sThisArg: SValue<any>, sArgArray: SValue<any>[], mProvider: SMetadataProvider<any>) => SValue<any>;
export type AnySFunction = SandboxedFunctionCall & SObjectProperties & UnknownFunction;
export type UnknownFunction = (...args: (any | unknown)[]) => unknown;