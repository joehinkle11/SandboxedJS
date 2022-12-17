import type { SMetadataProvider } from "../SMetadataProvider";
import type { MaybeSValueMetadata } from "../SValueMetadata";


import type { JSTypeOfString, SValueKind } from "./SValueDef";
import type { SNumberValue } from "./SPrimitiveValues/SNumberValue";
import type { SPrimitiveValue } from "./SPrimitiveValues/SPrimitiveValue";
import type { SArrayObject } from "./SObjects/SArrayObject";
import type { SBooleanValue } from "./SPrimitiveValues/SBooleanValue";
import type { SStringValue } from "./SPrimitiveValues/SStringValue";
import type { SSymbolValue } from "./SPrimitiveValues/SSymbolValue";
import type { SUndefinedValue } from "./SPrimitiveValues/SUndefinedValue";
import { combineMetadata, sBinaryAdd, sBinaryDiv, sBinaryExpo, sBinaryMod, sBinaryMult, sBinarySubtract, sBitwiseAND, sBitwiseLeftShift, sBitwiseNOT, sBitwiseOR, sBitwiseRightShift, sBitwiseUnsignedRight, sBitwiseXOR, sCompEqualValue, sCompEqualValueAndEqualType, sCompGreaterThan, sCompGreaterThanOrEqualTo, sCompLessThan, sCompLessThanOrEqualTo, sCompNotEqualValue, sCompNotEqualValueAndEqualType, sOwnKeys, sToPropertyKey, sToString, sUnaryTypeOf } from "./SValueImpl";

export abstract class SValue<M extends MaybeSValueMetadata> {
  get sContext(): this { return this }
  abstract get sValueKind(): SValueKind;
  abstract metadata: M;
  abstract nativeJsValue: any;
  sToString: (mProvider: SMetadataProvider<M>) => SValue<M> = sToString;
  sToPropertyKey: (mProvider: SMetadataProvider<M>) => string | symbol = sToPropertyKey;
  abstract sUnaryNegate(): SValue<M>;
  abstract sUnaryMakePositive(): SValue<M>;
  abstract sUnaryTypeOfAsNative(): JSTypeOfString;
  sUnaryTypeOf: () => SStringValue<M, JSTypeOfString> = sUnaryTypeOf;
  abstract sUnaryLogicalNot(): SBooleanValue<M, boolean>;
  abstract sLogicalNullish<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue;
  abstract sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue;
  abstract sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue;
  abstract sChainExpression(p: string | symbol, mProvider: SMetadataProvider<M>): SUndefinedValue<M> | SValue<M>;
  abstract sOwnKeysNative(): (string | symbol)[];
  sOwnKeys: () => SArrayObject<M, SStringValue<M, string> | SSymbolValue<M, symbol>> = sOwnKeys;
  abstract sGet(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>): SValue<M>;
  abstract sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean>;
  abstract sApply(thisArg: SValue<M>, args: SValue<M>[], mProvider: SMetadataProvider<M>): SValue<M>;
  combineMetadata: (anotherValue: SValue<M>, mProvider: SMetadataProvider<M>) => M = combineMetadata;
  abstract addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this;
  sBinaryAdd: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SPrimitiveValue<M, any> = sBinaryAdd;
  sBinarySubtract: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SPrimitiveValue<M, any> = sBinarySubtract;
  sBinaryMult: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SPrimitiveValue<M, any> = sBinaryMult;
  sBinaryDiv: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SPrimitiveValue<M, any> = sBinaryDiv;
  sBinaryExpo: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SPrimitiveValue<M, any> = sBinaryExpo;
  sBinaryMod: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SPrimitiveValue<M, any> = sBinaryMod;
  sBitwiseAND: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SNumberValue<M, number> = sBitwiseAND;
  sBitwiseOR: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SNumberValue<M, number> = sBitwiseOR;
  sBitwiseNOT: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SNumberValue<M, number> = sBitwiseNOT;
  sBitwiseXOR: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SNumberValue<M, number> = sBitwiseXOR;
  sBitwiseLeftShift: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SNumberValue<M, number> = sBitwiseLeftShift;
  sBitwiseRightShift: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SNumberValue<M, number> = sBitwiseRightShift;
  sBitwiseUnsignedRight: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SNumberValue<M, number> = sBitwiseUnsignedRight;
  sCompEqualValue: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SBooleanValue<M, boolean> = sCompEqualValue;
  sCompEqualValueAndEqualType: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SBooleanValue<M, boolean> = sCompEqualValueAndEqualType;
  sCompNotEqualValue: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SBooleanValue<M, boolean> = sCompNotEqualValue;
  sCompNotEqualValueAndEqualType: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SBooleanValue<M, boolean> = sCompNotEqualValueAndEqualType;
  sCompGreaterThan: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SBooleanValue<M, boolean> = sCompGreaterThan;
  sCompLessThan: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SBooleanValue<M, boolean> = sCompLessThan;
  sCompGreaterThanOrEqualTo: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SBooleanValue<M, boolean> = sCompGreaterThanOrEqualTo;
  sCompLessThanOrEqualTo: (right: SValue<M>, mProvider: SMetadataProvider<M>) => SBooleanValue<M, boolean> = sCompLessThanOrEqualTo;
}
