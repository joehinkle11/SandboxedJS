


export type SandboxedFunctionCall = (sThisArg: SValue<any>, sArgArray: SValue<any>[], mProvider: SMetadataProvider<any>) => SValue<any>;
export type AnySFunction = SandboxedFunctionCall & SObjectProperties & UnknownFunction;
export type UnknownFunction = (...args: unknown[]) => unknown;