import type { MaybeSValueMetadata } from "../SValueMetadata";
import type { JSTypeOfString, SReceiverOrTarget, SValueKind } from "./SValueDef";
import type { SNumberValue } from "./SPrimitiveValues/SNumberValue";
import type { SPrimitiveValue } from "./SPrimitiveValues/SPrimitiveValue";
import type { SArrayObject } from "./SObjects/SArrayObject";
import type { SBooleanValue } from "./SPrimitiveValues/SBooleanValue";
import type { SStringValue } from "./SPrimitiveValues/SStringValue";
import type { SSymbolValue } from "./SPrimitiveValues/SSymbolValue";
import type { SUndefinedValue } from "./SPrimitiveValues/SUndefinedValue";
import type { SObjectValue } from "./SObjects/SObjectValue";
import type { SBigIntValue } from "./SPrimitiveValues/SBigIntValue";
import type { SLocalSymbolTable, SRootSymbolTable } from "../SLocalSymbolTable";
import type { SFunction } from "./SObjects/SFunction";
import { combineMetadata, sBinaryAdd, sBinaryDiv, sBinaryExpo, sBinaryMod, sBinaryMult, sBinarySubtract, sBitwiseAND, sBitwiseLeftShift, sBitwiseNOT, sBitwiseOR, sBitwiseRightShift, sBitwiseUnsignedRight, sBitwiseXOR, sCompEqualValue, sCompEqualValueAndEqualType, sCompGreaterThan, sCompGreaterThanOrEqualTo, sCompLessThan, sCompLessThanOrEqualTo, sCompNotEqualValue, sCompNotEqualValueAndEqualType, sInstanceof, sOwnKeys, sToPropertyKey, sToString, sUnaryTypeOf } from "./SValueImpl";
import { SValues } from "./AllSValues";

export abstract class SValue<M extends MaybeSValueMetadata> {
  get sContext(): this { return this }
  abstract get sValueKind(): SValueKind;
  abstract metadata: M;
  abstract getNativeJsValue(rootSTable: SRootSymbolTable<M>): any;
  sToString: (sTable: SLocalSymbolTable<M>) => SValue<M> = sToString;
  sToPropertyKey: (sTable: SLocalSymbolTable<M>) => string | symbol = sToPropertyKey;
  abstract sUnaryNegate(): SValue<M>;
  abstract sUnaryMakePositive(): SValue<M>;
  abstract sUnaryTypeOfAsNative(): JSTypeOfString;
  sUnaryTypeOf: () => SStringValue<M, JSTypeOfString> = sUnaryTypeOf;
  abstract sUnaryLogicalNot(): SBooleanValue<M, boolean>;
  abstract sLogicalNullish<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue;
  abstract sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue;
  abstract sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue;
  abstract sChainExpression(p: string | symbol, sTable: SLocalSymbolTable<M>): SUndefinedValue<M> | SValue<M>;
  abstract sOwnKeysNative(): (string | symbol)[];
  sOwnKeys: (sTable: SLocalSymbolTable<M>) => SArrayObject<M, SStringValue<M, string> | SSymbolValue<M, symbol>> = sOwnKeys;
  abstract sConvertToObject(sTable: SLocalSymbolTable<M>): SObjectValue<M, any, any>;
  abstract sConvertToBooleanPrimitive(): SBooleanValue<M, boolean>;
  abstract sConvertToBigIntPrimitive(): SBigIntValue<M, bigint>;
  abstract sConvertToStringPrimitive(): SStringValue<M, string>;
  abstract sConvertToNumberPrimitive(): SNumberValue<M, number>;
  abstract sConvertToSymbolPrimitive(): SSymbolValue<M, symbol>;
  abstract sHasNative(p: string | symbol): boolean;
  sHas(p: string | symbol, sTable: SLocalSymbolTable<M>): SBooleanValue<M, boolean> {
    return new SValues.SBooleanValue(this.sHasNative(p), sTable.newMetadataForRuntimeTimeEmergingValue());
  };
  // abstract sDefineOwnPropertyNative(p: string | symbol, desc: ECMA_PropertyDescriptor, sTable: SLocalSymbolTable<any>): boolean;
  // sDefineOwnProperty(p: string | symbol, desc: ECMA_PropertyDescriptor, sTable: SLocalSymbolTable<any>): SBooleanValue<M, boolean> {
  //   return new SValues.SBooleanValue(this.sDefineOwnPropertyNative(p, desc, sTable), this.metadata);
  // }
  // abstract sIsCallableNative(): boolean;
  // sIsCallable(): SBooleanValue<M, boolean> {
  //   return new SValues.SBooleanValue(this.sIsCallableNative(), this.metadata);
  // }

  // todo: remove sToBooleanNative and sToBoolean
  abstract sToBooleanNative(): boolean;
  sToBoolean(): SBooleanValue<M, boolean> {
    return new SValues.SBooleanValue(this.sToBooleanNative(), this.metadata);
  }
  abstract sIsTruthyNative(): boolean;
  sIsTruthy(): SBooleanValue<M, boolean> {
    return new SValues.SBooleanValue(this.sIsTruthyNative(), this.metadata);
  }
  
  abstract sGet(p: string | symbol, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>): SValue<M>;
  abstract sSet<T extends SValue<M>>(p: string | symbol, newValue: T, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>): T;
  abstract sApply(thisArg: SValue<M>, args: SValue<M>[], sTable: SLocalSymbolTable<M>): SValue<M>;
  abstract sConstruct(args: SValue<M>[], newTarget: SFunction<any>, sTable: SLocalSymbolTable<M>): SObjectValue<M, any, any>;
  combineMetadata: (anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>) => M = combineMetadata;
  abstract addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this;
  sBinaryAdd: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SPrimitiveValue<M, any> = sBinaryAdd;
  sBinarySubtract: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SPrimitiveValue<M, any> = sBinarySubtract;
  sBinaryMult: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SPrimitiveValue<M, any> = sBinaryMult;
  sBinaryDiv: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SPrimitiveValue<M, any> = sBinaryDiv;
  sBinaryExpo: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SPrimitiveValue<M, any> = sBinaryExpo;
  sBinaryMod: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SPrimitiveValue<M, any> = sBinaryMod;
  sBitwiseAND: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SNumberValue<M, number> = sBitwiseAND;
  sBitwiseOR: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SNumberValue<M, number> = sBitwiseOR;
  sBitwiseNOT: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SNumberValue<M, number> = sBitwiseNOT;
  sBitwiseXOR: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SNumberValue<M, number> = sBitwiseXOR;
  sBitwiseLeftShift: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SNumberValue<M, number> = sBitwiseLeftShift;
  sBitwiseRightShift: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SNumberValue<M, number> = sBitwiseRightShift;
  sBitwiseUnsignedRight: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SNumberValue<M, number> = sBitwiseUnsignedRight;
  sCompEqualValue: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SBooleanValue<M, boolean> = sCompEqualValue;
  sCompEqualValueAndEqualType: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SBooleanValue<M, boolean> = sCompEqualValueAndEqualType;
  sCompNotEqualValue: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SBooleanValue<M, boolean> = sCompNotEqualValue;
  sCompNotEqualValueAndEqualType: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SBooleanValue<M, boolean> = sCompNotEqualValueAndEqualType;
  sCompGreaterThan: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SBooleanValue<M, boolean> = sCompGreaterThan;
  sCompLessThan: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SBooleanValue<M, boolean> = sCompLessThan;
  sCompGreaterThanOrEqualTo: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SBooleanValue<M, boolean> = sCompGreaterThanOrEqualTo;
  sCompLessThanOrEqualTo: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SBooleanValue<M, boolean> = sCompLessThanOrEqualTo;
  sInstanceof: (right: SValue<M>, sTable: SLocalSymbolTable<M>) => SBooleanValue<M, boolean> = sInstanceof;
}
