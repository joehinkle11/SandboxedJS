
import type { SBigIntValue } from "./SBigIntValue";
import type { SNullValue } from "./SNullValue";
import type { SNumberValue } from "./SNumberValue";
import type { SStringValue } from "./SStringValue";
import type { SSymbolValue } from "./SSymbolValue";
import type { SUndefinedValue } from "./SUndefinedValue";

export type MapSPrimitiveValueTypeToSType<P extends SPrimitiveValueType, M extends MaybeSValueMetadata> = P extends bigint ? SBigIntValue<M, P> : P extends boolean ? SBooleanValue<M, P> : P extends number ? SNumberValue<M, P> : P extends string ? SStringValue<M, P> : P extends undefined ? SUndefinedValue<M> : P extends null ? SNullValue<M> : P extends symbol ? SSymbolValue<M, P> : never;
export type SPrimitiveValueType = bigint | boolean | number | string | undefined | null | symbol;