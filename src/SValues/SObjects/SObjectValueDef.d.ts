// import { hiddenSObjectStorageSymbol } from "../../HiddenSymbols";
import type { MapNativeValueTypeToSType, SReceiver } from "../SValueDef";
import type { UnknownFunction, UnknownConstructorFunction, AnySFunction, SandboxedFunctionCall, SandboxedFunctionGetterCall, SandboxedConstructorFunctionCall, SandboxedConstructorFunctionCallAsNormalCall } from "./SFunctionDef";
import type { SPrimitiveValueType, MapSPrimitiveValueTypeToSType, SPrimitiveValue } from "../SPrimitiveValues/SPrimitiveValueDef";
import type { SNullValue } from "../SPrimitiveValues/SNullValue";
import type { SObjectValue } from "./SObjectValue";
import type { SFunction } from "./SFunction";
import type { SValue } from "../SValue";
import { SLocalSymbolTable } from "../../SLocalSymbolTable";


export type SBuiltInFunctionObjectKind = "function" | "arrow-function";
export type SBuiltInNonFunctionObjectKind = "normal" | "array";
export type SBuiltInObjectKind = SBuiltInFunctionObjectKind | SBuiltInNonFunctionObjectKind;
export type SObjectProperties = Record<PropertyKey, SValue<any> | undefined>;
export type BaseSObjectStorage = SObjectProperties & object;
export type MapSBuiltInObjectKindToSObjectStorage<K extends SBuiltInObjectKind> = BaseSObjectStorage &
  K extends "normal" ? BaseSObjectStorage
    : K extends "array" ? Array<any>
    : K extends "function" ? AnySFunction
    : K extends "arrow-function" ? AnySFunction
    : BaseSObjectStorage;


export type SWhiteListEntry = true;
export type SSwizzleEntry<V> = MapNativeValueTypeToSType<V>;
export type SDynamicSwizzleEntry<V> = SandboxedFunctionGetterCall;
export type SSwizzleOrWhiteListEntry<V> = V extends SPrimitiveValueType ? SWhiteListEntry | SSwizzleEntry<V> : SSwizzleEntry<V>;
export type SObjectSwizzleAndWhiteList<O extends object> = {
  [P in keyof O as O[P] extends SPrimitiveValueType ? `whitelist_${string & P}` : never]?: SWhiteListEntry;
} & {
  [P in keyof O as `swizzle_static_${string & P}`]?: SSwizzleEntry<O[P]>;
} & {
  [P in keyof O as `swizzle_dynamic_${string & P}`]?: SDynamicSwizzleEntry<O[P]>;
} & (O extends UnknownFunction ? SFunctionSwizzleAndWhiteList : unknown)& (O extends UnknownConstructorFunction ? SConstructorFunctionSwizzleAndWhiteList : unknown);
export type SFunctionSwizzleAndWhiteList = {
  swizzled_apply_raw: SandboxedFunctionCall
  swizzled_apply_proxied?: never
} | {
  swizzled_apply_raw?: never
  swizzled_apply_proxied: UnknownFunction
}
export type SConstructorFunctionSwizzleAndWhiteList = {
  swizzled_construct_raw: SandboxedConstructorFunctionCallAsNormalCall
  swizzled_construct_proxied?: never
} | {
  swizzled_apply_raw?: never
  swizzled_construct_proxied: UnknownFunction
}
export type AnySObjectSwizzleAndWhiteList = SObjectSwizzleAndWhiteList<any>;

export type SPrototypeType = (SPrototypeDeterminedType) | (() => SPrototypeDeterminedType)
export type SPrototypeDeterminedType = SObjectValue<M, any, any> | SNullValue<M>

// export type SObjectHiddenFromUserData = {
//   getSThis: () => SObjectValue<any, any, any> | undefined
// }

export type SObjectPropertyGetterAccessThis = {
  sReceiver: SReceiver<any>
  sTable: SLocalSymbolTable<any>
}
export type SObjectPropertySetterAccessInfo = {
  newValue: SValue<any>
  sReceiver: SReceiver<any>
  sTable: SLocalSymbolTable<any>
}
