import type { SObjectValue } from "./SObjects/SObjectValue";
import type { SPrimitiveValueType, MapSPrimitiveValueTypeToSType, SPrimitiveValue } from "./SPrimitiveValues/SPrimitiveValue";

export type JSTypeOfString = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

export type MapNativeValueTypeToSType<V> = V extends SPrimitiveValueType ? MapSPrimitiveValueTypeToSType<V, any> : SObjectValue<any, any, any>;

export type SValueKind = "s-object" | SValuePrimitiveKind;
export type SValuePrimitiveKind = "s-boolean" | "s-number" | "s-bigint" | "s-string" | "s-undefined" | "s-null" | "s-symbol";