
export const SValues = {
  SValue: undefined as any as typeof SValue,
  SPrimitiveValue: undefined as any as typeof SPrimitiveValue,
  SBigIntValue: undefined as any as typeof SBigIntValue,
  SBooleanValue: undefined as any as typeof SBooleanValue,
  SNullValue: undefined as any as typeof SNullValue,
  SNumberValue: undefined as any as typeof SNumberValue,
  SStringValue: undefined as any as typeof SStringValue,
  SSymbolValue: undefined as any as typeof SSymbolValue,
  SUndefinedValue: undefined as any as typeof SUndefinedValue,
  SReferencedObjectValue: undefined as any as typeof SReferencedObjectValue,
  SObjectValue: undefined as any as typeof SObjectValue,
  SNormalObject: undefined as any as typeof SNormalObject,
  SArrayObject: undefined as any as typeof SArrayObject,
  SFunction: undefined as any as typeof SFunction,
  WeakRefToSValue: undefined as any as typeof WeakRefToSValue,
}

// Base
import { SValue } from "./SValue";

// Primitives
import { SPrimitiveValue } from "./SPrimitiveValues/SPrimitiveValue";
import { SBigIntValue } from "./SPrimitiveValues/SBigIntValue";
import { SBooleanValue } from "./SPrimitiveValues/SBooleanValue";
import { SNullValue } from "./SPrimitiveValues/SNullValue";
import { SNumberValue } from "./SPrimitiveValues/SNumberValue";
import { SStringValue } from "./SPrimitiveValues/SStringValue";
import { SSymbolValue } from "./SPrimitiveValues/SSymbolValue";
import { SUndefinedValue } from "./SPrimitiveValues/SUndefinedValue";
import { SReferencedObjectValue } from "./SObjects/SReferencedObjectValue";

// Objects
import { SObjectValue } from "./SObjects/SObjectValue";
import { SNormalObject } from "./SObjects/SNormalObject";
import { SArrayObject } from "./SObjects/SArrayObject";
import { SFunction } from "./SObjects/SFunction";
import { WeakRefToSValue } from "./WeakRefToSValue";
// import { SMergedObjects } from "./SObjects/SMergedObjects";

SValues.SValue = SValue;
SValues.SPrimitiveValue = SPrimitiveValue;
SValues.SBigIntValue = SBigIntValue;
SValues.SBooleanValue = SBooleanValue;
SValues.SNullValue = SNullValue;
SValues.SNumberValue = SNumberValue;
SValues.SStringValue = SStringValue;
SValues.SSymbolValue = SSymbolValue;
SValues.SUndefinedValue = SUndefinedValue;
SValues.SReferencedObjectValue = SReferencedObjectValue;
SValues.SObjectValue = SObjectValue;
SValues.SNormalObject = SNormalObject;
SValues.SArrayObject = SArrayObject;
SValues.SFunction = SFunction;
SValues.WeakRefToSValue = WeakRefToSValue;
// SValues.SMergedObjects = SMergedObjects;
Object.freeze(SValue);