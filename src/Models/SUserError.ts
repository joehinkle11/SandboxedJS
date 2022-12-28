import type { SValue } from "../SValues/SValue";

// An error in user-space (i.e., not an issue with the transpiler, but user code).
export default class SUserError extends Error {
  userError: Error;

  get message(): string {
    return this.userError.message;
  }
  get name(): string {
    return this.userError.name;
  }
  get cause(): unknown | undefined {
    return this.userError.cause;
  }
  get stack(): string | undefined {
    return this.userError.stack;
  }

  constructor(userError: Error) {
    super();
    this.userError = userError;
  }
  static get corruptObjectPropertyFail(): SUserError {
    return new SUserError(new Error("Detected corrupt object property."));
  }
  static get failedToSetPropertyOnObject(): SUserError {
    return new SUserError(new Error("Failed to set property on object."));
  }
  static get invalidMixBigInt(): SUserError {
    return new SUserError(new Error("TypeError: Invalid mix of BigInt and other type in addition."));
  }
  static get missingRequiredArgument(): SUserError {
    return new SUserError(new Error("Missing required argument."));
  }
  static get cannotConvertBigIntToNumber(): SUserError {
    return new SUserError(new Error("Conversion from 'BigInt' to 'number' is not allowed."));
  }
  static get cannotConvertToObject(): SUserError {
    return new SUserError(new Error("Cannot convert undefined or null to object"));
  }
  static get cannotConvertObjectToPrimitive(): SUserError {
    return new SUserError(new Error(`Cannot convert object to primitive value.`));
  }
  static get invalidPropertyDescriptor(): SUserError {
    return new SUserError(new Error(`Invalid property descriptor. Cannot both specify accessors and a value or writable attribute`));
  }
  static failedToSetProperty(propertyName: string): SUserError {
    return new SUserError(new Error(`Could not set property '${propertyName}'.`));
  }
  static unexpectedType(requiredTypeName: string): SUserError {
    return new SUserError(new Error(`Unexpected non-${requiredTypeName} type found.`));
  }
  static requiredThisType(requiredTypeName: string): SUserError {
    return new SUserError(new Error(`Requires that 'this' be a ${requiredTypeName}.`));
  }
  static symbolNotDefined(symbolName: string): SUserError {
    return new SUserError(new Error(`ReferenceError: ${symbolName} is not defined.`));
  }
  static cannotUpdateUndefinedSymbol(symbolName: string): SUserError {
    return new SUserError(new Error(`ReferenceError: Cannot update undefined symbol '${symbolName}'.`));
  }
  static cannotCall(valueDescription: string): SUserError {
    return new SUserError(new Error(`Cannot call '${valueDescription}'.`));
  }
  static expectedCallable(valueDescription: string): SUserError {
    return new SUserError(new Error(`Expected '${valueDescription}' to be callable.`));
  }
  static requiresNew(valueDescription: string): SUserError {
    return new SUserError(new Error(`TypeError: Constructor ${valueDescription} requires 'new'.`));
  }
  static notAConstructor(valueDescription: string): SUserError {
    return new SUserError(new Error(`TypeError: ${valueDescription} is not a constructor.`));
  }
  static cannotReadPropertiesOfNull(propName: string): SUserError {
    return new SUserError(new Error(`TypeError: Cannot read properties of null (reading '${propName}')`));
  }
  static cannotConstruct(valueDescription: string): SUserError {
    return new SUserError(new Error(`Cannot construct '${valueDescription}'.`));
  }
  static cannotPerformLogicalOp(op: string, value: SValue<any>): SUserError {
    return new SUserError(new Error(
      `Cannot perform logical operator "${op}" on ${value.constructor.name}`
    ));
  }
  static cannotPerformUnaryOp(op: string, value: SValue<any>): SUserError {
    return new SUserError(new Error(
      `Cannot perform unary operator "${op}" on ${value.constructor.name}`
    ));
  }
  static cannotPerformBinaryOp(op: string, left: SValue<any>, right: SValue<any>): SUserError {
    return new SUserError(new Error(
      `Cannot perform binary operator "${op}" on ${left.constructor.name} and ${right.constructor.name}`
    ));
  }
  static cannotPerformBitwiseOp(op: string, left: SValue<any>, right: SValue<any>): SUserError {
    return new SUserError(new Error(
      `Cannot perform bitwise operator "${op}" on ${left.constructor.name} and ${right.constructor.name}`
    ));
  }
  static cannotPerformComparison(op: string, left: SValue<any>, right: SValue<any>): SUserError {
    return new SUserError(new Error(
      `Cannot perform comparison operator "${op}" on ${left.constructor.name} and ${right.constructor.name}`
    ));
  }
}