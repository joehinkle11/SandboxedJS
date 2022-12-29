import type { SLocalSymbolTable } from "../SLocalSymbolTable";
import { SValues } from "../SValues/AllSValues";
import type { SValue } from "../SValues/SValue";

// An error in user-space (i.e., not an issue with the transpiler, but user code).
export default class SUserError extends Error {
  userError: Error | undefined;
  sUserError: SValue<any> | undefined;

  get message(): string {
    return this.userError?.message ?? "";
  }
  get name(): string {
    return this.userError?.name ?? "";
  }
  get cause(): unknown | undefined {
    return this.userError?.cause;
  }
  get stack(): string | undefined {
    return this.userError?.stack;
  }

  getSValue(sTable: SLocalSymbolTable<any>): SValue<any> {
    // todo: construct proper error objects to native/builtin errors
    return this.sUserError ?? new SValues.SStringValue(this.userError!.message!, sTable.newMetadataForRuntimeTimeEmergingValue());
  }

  private constructor(userError: Error | undefined, sUserError: SValue<any> | undefined) {
    super();
    this.userError = userError;
    this.sUserError = sUserError;
  }

  static userError(sValue: SValue<any>): SUserError {
    return new SUserError(undefined, sValue);
  }

  static builtInError(message: string): SUserError {
    return new SUserError(new Error(message), undefined);
  }
  
  static get corruptObjectPropertyFail(): SUserError {
    return SUserError.builtInError("Detected corrupt object property.");
  }
  static get failedToSetPropertyOnObject(): SUserError {
    return SUserError.builtInError("Failed to set property on object.");
  }
  static get invalidMixBigInt(): SUserError {
    return SUserError.builtInError("TypeError: Invalid mix of BigInt and other type in addition.");
  }
  static get missingRequiredThis(): SUserError {
    return SUserError.builtInError("Missing required 'this'.");
  }
  static get missingRequiredArgument(): SUserError {
    return SUserError.builtInError("Missing required argument.");
  }
  static get cannotConvertBigIntToNumber(): SUserError {
    return SUserError.builtInError("Conversion from 'BigInt' to 'number' is not allowed.");
  }
  static get cannotConvertToObject(): SUserError {
    return SUserError.builtInError("Cannot convert undefined or null to object");
  }
  static get cannotConvertObjectToPrimitive(): SUserError {
    return SUserError.builtInError(`Cannot convert object to primitive value.`);
  }
  static get invalidPropertyDescriptor(): SUserError {
    return SUserError.builtInError(`Invalid property descriptor. Cannot both specify accessors and a value or writable attribute`);
  }
  static cannotConvertToPrimitive(primitiveTypeName: string): SUserError {
    return SUserError.builtInError(`Cannot convert value to primitive ${primitiveTypeName}.`);
  }
  static failedToSetProperty(propertyName: string): SUserError {
    return SUserError.builtInError(`Could not set property '${propertyName}'.`);
  }
  static unexpectedType(requiredTypeName: string): SUserError {
    return SUserError.builtInError(`Unexpected non-${requiredTypeName} type found.`);
  }
  static requiredThisType(requiredTypeName: string): SUserError {
    return SUserError.builtInError(`Requires that 'this' be a ${requiredTypeName}.`);
  }
  static symbolNotDefined(symbolName: string): SUserError {
    return SUserError.builtInError(`ReferenceError: ${symbolName} is not defined.`);
  }
  static globallyExposedSymbolNotAPrimitive(symbolName: string): SUserError {
    return SUserError.builtInError(`Unexpectedly found globally exposed host symbol '${symbolName}' was not a primitive.`);
  }
  static symbolConflictsWithGloballyExposedSymbol(symbolName: string): SUserError {
    return SUserError.builtInError(`Symbol ${symbolName} cannot be declared. It conflicts with an exposed host symbol.`);
  }
  static cannotUpdateUndefinedSymbol(symbolName: string): SUserError {
    return SUserError.builtInError(`ReferenceError: Cannot update undefined symbol '${symbolName}'.`);
  }
  static cannotCallDueToType(typeStr: string): SUserError {
    return SUserError.builtInError(`Cannot call value of type ${typeStr}.`);
  }
  static cannotCall(valueDescription: string): SUserError {
    return SUserError.builtInError(`Cannot call '${valueDescription}'.`);
  }
  static expectedCallable(valueDescription: string): SUserError {
    return SUserError.builtInError(`Expected '${valueDescription}' to be callable.`);
  }
  static requiresNew(valueDescription: string): SUserError {
    return SUserError.builtInError(`TypeError: Constructor ${valueDescription} requires 'new'.`);
  }
  static notAConstructor(valueDescription: string): SUserError {
    return SUserError.builtInError(`TypeError: ${valueDescription} is not a constructor.`);
  }
  static cannotReadPropertiesOfNull(propName: string): SUserError {
    return SUserError.builtInError(`TypeError: Cannot read properties of null (reading '${propName}')`);
  }
  static cannotConstruct(valueDescription: string): SUserError {
    return SUserError.builtInError(`Cannot construct '${valueDescription}'.`);
  }
  static cannotPerformLogicalOp(op: string, value: SValue<any>): SUserError {
    return SUserError.builtInError(
      `Cannot perform logical operator "${op}" on ${value.constructor.name}`
    );
  }
  static cannotPerformUnaryOp(op: string, value: SValue<any>): SUserError {
    return SUserError.builtInError(
      `Cannot perform unary operator "${op}" on ${value.constructor.name}`
    );
  }
  static cannotPerformBinaryOp(op: string, left: SValue<any>, right: SValue<any>): SUserError {
    return SUserError.builtInError(
      `Cannot perform binary operator "${op}" on ${left.constructor.name} and ${right.constructor.name}`
    );
  }
  static cannotPerformBitwiseOp(op: string, left: SValue<any>, right: SValue<any>): SUserError {
    return SUserError.builtInError(
      `Cannot perform bitwise operator "${op}" on ${left.constructor.name} and ${right.constructor.name}`
    );
  }
  static cannotPerformComparison(op: string, left: SValue<any>, right: SValue<any>): SUserError {
    return SUserError.builtInError(
      `Cannot perform comparison operator "${op}" on ${left.constructor.name} and ${right.constructor.name}`
    );
  }
}