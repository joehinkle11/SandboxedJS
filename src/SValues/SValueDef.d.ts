import { MaybeSValueMetadata } from "../SValueMetadata";
import type { SObjectValue } from "./SObjects/SObjectValue";
import type { SPrimitiveValueType, MapSPrimitiveValueTypeToSType, SPrimitiveValue } from "./SPrimitiveValues/SPrimitiveValueDef";
import { SValue } from "./SValue";

export type JSTypeOfString = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

export type MapNativeValueTypeToSType<V> = V extends unknown ? SValue<any> : V extends SPrimitiveValueType ? MapSPrimitiveValueTypeToSType<V, any> : SObjectValue<any, any, any>;

export type SValueKind = "s-object" | SValuePrimitiveKind;
export type SValuePrimitiveKind = "s-boolean" | "s-number" | "s-bigint" | "s-string" | "s-undefined" | "s-null" | "s-symbol";

export type SReceiver<M extends MaybeSValueMetadata> = SValue<M>;
export type SReceiverOrTarget<M extends MaybeSValueMetadata> = SReceiver<M> | "target";