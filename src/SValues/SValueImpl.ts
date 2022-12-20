import SUserErrorImport from "../Models/SUserError";
const SUserError = SUserErrorImport;
import type { SMetadataProvider } from "../SMetadataProvider";
import type { MaybeSValueMetadata } from "../SValueMetadata";
import { SValues as SValuesImported } from "./AllSValues";
const SValues = SValuesImported;
import type { SStringValue } from "./SPrimitiveValues/SStringValue";
import type { SSymbolValue } from "./SPrimitiveValues/SSymbolValue";
import type { SPrimitiveValue } from "./SPrimitiveValues/SPrimitiveValue";
import type { SNumberValue } from "./SPrimitiveValues/SNumberValue";
import type { SBooleanValue } from "./SPrimitiveValues/SBooleanValue";
import type { SValue } from "./SValue";
import { $$ts } from "ts-macros";
import { JSTypeOfString } from "./SValueDef";
import type { SArrayObject } from "./SObjects/SArrayObject";
import type { SLocalSymbolTable } from "../SLocalSymbolTable";

export function sToString<M extends MaybeSValueMetadata>(
  this: SValue<M>,
  sTable: SLocalSymbolTable<M>
): SValue<M> { // it is possible for the user to overwrite the `toString` function so that it does not return a string
  return this.sGet("toString", this, sTable).sApply(this, [], sTable);
};
export function sToPropertyKey<M extends MaybeSValueMetadata>(
  this: SValue<M>,
  sTable: SLocalSymbolTable<M>
): string | symbol {
  const sValue = this.sToString(sTable);
  if (sValue instanceof SValues.SStringValue) {
    return sValue.nativeJsValue;
  }
  throw SUserError.cannotConvertObjectToPrimitive;
};

export function sUnaryTypeOf<M extends MaybeSValueMetadata>(
  this: SValue<M>,
): SStringValue<M, JSTypeOfString> {
  return new SValues.SStringValue(this.sUnaryTypeOfAsNative(), this.metadata);
}

export function sOwnKeys<M extends MaybeSValueMetadata>(
  this: SValue<M>,
): SArrayObject<M, SStringValue<M, string> | SSymbolValue<M, symbol>> {
  const array: (SStringValue<M, string> | SSymbolValue<M, symbol>)[] = this.sOwnKeysNative().map((r) => {
    if (typeof r === "string") {
      return new SValues.SStringValue(r, this.metadata);
    } else {
      return new SValues.SSymbolValue(r, this.metadata);
    }
  });
  return SValues.SArrayObject.createWithMetadata(array, this.metadata);
}

export function combineMetadata<M extends MaybeSValueMetadata>(
  this: SValue<M>,
  anotherValue: SValue<M>,
  mProvider: SMetadataProvider<M>
): M {
  const valueMetadataSystem = mProvider.valueMetadataSystem;
  return valueMetadataSystem === null ? undefined : valueMetadataSystem.newMetadataForCombiningValues(this, anotherValue);
}

function $sBinaryOpOnPrimitives(binaryOp: "+" | "-" | "*" | "/" | "**" | "%") {
  $$ts!(`
    const resultingMetadata = this.combineMetadata(right, mProvider);
    const opResult = this.nativeJsValue ${binaryOp} right.nativeJsValue;
    const newSPrimitive = SValues.SPrimitiveValue.newPrimitiveFromJSValue(opResult, resultingMetadata);
    if (newSPrimitive !== null) {
      return newSPrimitive;
    }
    throw SUserError.cannotPerformBinaryOp("${binaryOp}", this, right);
  `);
}
function $sBitwiseOpOnPrimitive(bitwise: "&" | "|" | "~" | "^" | "<<" | ">>" | ">>>") {
  $$ts!(`
    const resultingMetadata = this.combineMetadata(right, mProvider);
    const bitwiseResult = this.nativeJsValue ${bitwise} right.nativeJsValue;
    if (typeof bitwiseResult === "number") {
      const newSNumber = new SValues.SNumberValue(bitwiseResult, resultingMetadata);
      if (newSNumber !== null) {
        return newSNumber;
      }
    } else {
      // probably is a bigint
      const newSBigInt = new SValues.SBigIntValue(bitwiseResult, resultingMetadata);
      if (newSBigInt !== null) {
        return newSBigInt;
      }
    }
    throw SUserError.cannotPerformBitwiseOp("${bitwise}", this, right);
  `);
}

function $sComparisonOpOnPrimitive(comparison: "==" | "===" | "!=" | "!==" | ">" | "<" | ">=" | "<=") {
  $$ts!(`
    const resultingMetadata = this.combineMetadata(right, mProvider);
    const comparisonResult = this.nativeJsValue ${comparison} right.nativeJsValue;
    const newSBoolean = new SValues.SBooleanValue(comparisonResult, resultingMetadata);
    if (newSBoolean !== null) {
      return newSBoolean;
    }
    throw SUserError.cannotPerformBitwiseOp("${comparison}", this, right);
  `);
}

// @ts-expect-error
export function sBinaryAdd<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SPrimitiveValue<M, any> {
  $sBinaryOpOnPrimitives!("+");
}
// @ts-expect-error
export function sBinarySubtract<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SPrimitiveValue<M, any> {
  $sBinaryOpOnPrimitives!("-");
}
// @ts-expect-error
export function sBinaryMult<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SPrimitiveValue<M, any> {
  $sBinaryOpOnPrimitives!("*");
}
// @ts-expect-error
export function sBinaryDiv<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SPrimitiveValue<M, any> {
  $sBinaryOpOnPrimitives!("/");
}
// @ts-expect-error
export function sBinaryExpo<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SPrimitiveValue<M, any> {
  $sBinaryOpOnPrimitives!("**");
}
// @ts-expect-error
export function sBinaryMod<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SPrimitiveValue<M, any> {
  $sBinaryOpOnPrimitives!("%");
}
// @ts-expect-error
export function sBitwiseAND<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SNumberValue<M, number> {
  $sBitwiseOpOnPrimitive!("&")
}
// @ts-expect-error
export function sBitwiseOR<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SNumberValue<M, number> {
  $sBitwiseOpOnPrimitive!("|")
}
// @ts-expect-error
export function sBitwiseNOT<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SNumberValue<M, number> {
  $sBitwiseOpOnPrimitive!("~")
}
// @ts-expect-error
export function sBitwiseXOR<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SNumberValue<M, number> {
  $sBitwiseOpOnPrimitive!("^")
}
// @ts-expect-error
export function sBitwiseLeftShift<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SNumberValue<M, number> {
  $sBitwiseOpOnPrimitive!("<<")
}
// @ts-expect-error
export function sBitwiseRightShift<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SNumberValue<M, number> {
  $sBitwiseOpOnPrimitive!(">>")
}
// @ts-expect-error
export function sBitwiseUnsignedRight<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SNumberValue<M, number> {
  $sBitwiseOpOnPrimitive!(">>>")
}
// @ts-expect-error
export function sCompEqualValue<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M, boolean> {
  $sComparisonOpOnPrimitive!("==")
}
// @ts-expect-error
export function sCompEqualValueAndEqualType<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M, boolean> {
  $sComparisonOpOnPrimitive!("===")
}
// @ts-expect-error
export function sCompNotEqualValue<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M, boolean> {
  $sComparisonOpOnPrimitive!("!=")
}
// @ts-expect-error
export function sCompNotEqualValueAndEqualType<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M, boolean> {
  $sComparisonOpOnPrimitive!("!==")
}
// @ts-expect-error
export function sCompGreaterThan<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M, boolean> {
  $sComparisonOpOnPrimitive!(">")
}
// @ts-expect-error
export function sCompLessThan<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M, boolean> {
  $sComparisonOpOnPrimitive!("<")
}
// @ts-expect-error
export function sCompGreaterThanOrEqualTo<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M, boolean> {
  $sComparisonOpOnPrimitive!(">=")
}
// @ts-expect-error
export function sCompLessThanOrEqualTo<M extends MaybeSValueMetadata>(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M, boolean> {
  $sComparisonOpOnPrimitive!("<=")
}