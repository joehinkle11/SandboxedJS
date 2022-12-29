

export const overrides: Partial<Record<string, OverrideEntry>> = {
  "Object.prototype.valueOf": {
    swizzled_apply_raw: `
      const sThisAsObj = sThisArg?.sConvertToObject(sTable);
      if (sThisAsObj) {
        return sThisAsObj;
      }
      throw SUserError.cannotConvertToObject;
      `
  },
  "Object.prototype.constructor": {
    swizzled_lookup_global_var_on_root: "Object"
  },
  "Object.getOwnPropertyNames": {
    swizzled_apply_raw: `
      const firstArgObj = sArgArray[0]?.sConvertToObject(sTable);
      if (firstArgObj) {
        return firstArgObj.sOwnKeys(sTable);
      }
      throw SUserError.cannotConvertToObject;
      `
  },
  "Object.defineProperty": {
    swizzled_apply_raw: `
      const firstArg = sArgArray[0];
      if (firstArg) {
        const firstArgObj = firstArg.sConvertToObject(sTable);
        const secondArg = sArgArray[1];
        if (secondArg) {
          const propertyKey = secondArg.sToPropertyKey(sTable);
          const thirdArg = sArgArray[2];
          if (thirdArg) {
            const thirdArgObj = thirdArg.sConvertToObject(sTable)
            return firstArgObj.sDefineProperty(propertyKey, thirdArgObj, sTable);
          } else {
            throw SUserError.cannotConvertToObject;
          }
        }
      }
      throw SUserError.missingRequiredArgument;
      `
  },
  "Object": {
    prototype_internal_builtin: "FunctionProtocol",
  },
  "Reflect": {
    prototype_internal_builtin: "ObjectProtocol",
  },
  "Reflect.get": {
    swizzled_apply_raw: `
      const firstArg = sArgArray[0];
      if (firstArg) {
        const secondArg = sArgArray[1];
        if (secondArg instanceof SValues.SStringValue || secondArg instanceof SValues.SSymbolValue) {
          const propertyKey: string | symbol = secondArg.nativeJsValue;
          const thirdArg = sArgArray[2];
          if (thirdArg) {
            return firstArg.sGet(propertyKey, thirdArg, sTable);
          } else {
            return firstArg.sGet(propertyKey, firstArg, sTable);
          }
        }
      }
      throw SUserError.missingRequiredArgument;
      `
  },
  "Function.prototype": {
    prototype_internal_builtin: "ObjectProtocol",
  },
  "Object.create": {
    swizzled_apply_raw: `
      const firstArg = sArgArray[0];
      if (firstArg instanceof SValues.SNullValue || firstArg instanceof SValues.SObjectValue) {
        return SValues.SNormalObject.create({}, firstArg, sTable);
      }
      throw SUserError.cannotConvertToObject;
      `
  },
  "Object.getPrototypeOf": {
    swizzled_apply_raw: `
      const firstArg = sArgArray[0]?.sConvertToObject(sTable);
      if (firstArg) {
        return firstArg.determinedSPrototype;
      }
      throw SUserError.cannotConvertToObject;
      `
  },
  "Object.setPrototypeOf": {
    swizzled_apply_raw: `
      const firstArg = sArgArray[0]?.sConvertToObject(sTable);
      if (firstArg) {
        const secondArg = sArgArray[1];
        if (secondArg instanceof SValues.SNullValue || secondArg instanceof SValues.SObjectValue) {
          firstArg.sPrototype = secondArg;
          return firstArg;
        }
      }
      throw SUserError.cannotConvertToObject;
      `
  },
  "Function.prototype.bind": {
    swizzled_apply_raw: `
      const thingToBind = sArgArray[0];
      if (sThisArg instanceof SValues.SFunction) {
        const sFuncToCall = sThisArg;
        return SValues.SFunction.createBinding(sFuncToCall, thingToBind, sTable);
      }
      throw new Error("Expected 'this' to be a function.");
      `
  },
  "Symbol": {
    swizzled_apply_raw: `
      const argsLength = sArgArray.length;
      const nativeArgs: any[] = [];
      if (argsLength > 0) {
        // add param "description" to call
        nativeArgs.push(SValues.SSymbolValue.sandboxedSymbolPrefix + sArgArray[0].getNativeJsValue(rootSTable));
      }
      const result: symbol = Reflect.apply(Symbol, sThisArg?.getNativeJsValue(rootSTable), nativeArgs);
      const sResult: SSymbolValue<any, symbol> = new SValues.SSymbolValue(result, sTable.newMetadataForRuntimeTimeEmergingValue());
      return sResult;
      `
  },
  "Symbol.for": {
    swizzled_apply_raw: `
      if (sArgArray.length < 1) {
        throw SUserError.missingRequiredArgument;
      }
      const sString = sArgArray[0].sConvertToStringPrimitive();
      const string = SValues.SSymbolValue.sandboxedSymbolPrefix + sString.nativeJsValue;
      const result: symbol = Symbol.for(string);
      return new SValues.SSymbolValue(result, sTable.newMetadataForRuntimeTimeEmergingValue());
      `
  },
  "Symbol.keyFor": {
    swizzled_apply_raw: `
      if (sArgArray.length < 1) {
        throw SUserError.missingRequiredThis;
      }
      const sSymbol = sArgArray[0].sConvertToSymbolPrimitive();
      const symbol = sSymbol.nativeJsValue;
      const result: string | undefined = Symbol.keyFor(symbol);
      if (result === undefined) {
        return new SValues.SUndefinedValue(sTable.newMetadataForRuntimeTimeEmergingValue());
      }
      if (result.startsWith(SValues.SSymbolValue.sandboxedSymbolPrefix)) {
        const fixedResult = result.slice(SValues.SSymbolValue.sandboxedSymbolPrefix.length);
        return new SValues.SStringValue(fixedResult, sTable.newMetadataForRuntimeTimeEmergingValue());
      }
      return new SValues.SStringValue(result, sTable.newMetadataForRuntimeTimeEmergingValue());
      `
  },
  "Symbol.prototype.toString": {
    swizzled_apply_raw: `
      if (sThisArg === undefined) {
        throw SUserError.missingRequiredArgument;
      }
      const sThisArgSymbol: SSymbolValue<any, symbol> = sThisArg.sConvertToSymbolPrimitive();
      const result: string | undefined = Reflect.get(Symbol.prototype, "description", sThisArgSymbol.nativeJsValue);
      let fixedResult: string = result ?? "";
      if (fixedResult.startsWith(SValues.SSymbolValue.sandboxedSymbolPrefix)) {
        fixedResult = fixedResult.slice(SValues.SSymbolValue.sandboxedSymbolPrefix.length);
      }
      return new SValues.SStringValue("Symbol(" + fixedResult + ")", sTable.newMetadataForRuntimeTimeEmergingValue());
      `
  },
  "Symbol.prototype.description": {
    swizzled_dynamic_property: `
      {
        const sThisArgSymbol: SSymbolValue<any, symbol> = sThisArg.sConvertToSymbolPrimitive();
        const result: string | undefined = Reflect.get(Symbol.prototype, "description", sThisArgSymbol.nativeJsValue);
        if (result === undefined) {
          return new SValues.SUndefinedValue(sTable.newMetadataForRuntimeTimeEmergingValue());
        }
        if (result.startsWith(SValues.SSymbolValue.sandboxedSymbolPrefix)) {
          const fixedResult = result.slice(SValues.SSymbolValue.sandboxedSymbolPrefix.length);
          return new SValues.SStringValue(fixedResult, sTable.newMetadataForRuntimeTimeEmergingValue());
        }
        return new SValues.SStringValue(result, sTable.newMetadataForRuntimeTimeEmergingValue());
      }
      `
  }
};

type OverrideEntry = {
  swizzled_apply_raw?: string;
  swizzled_lookup_global_var_on_root?: string;
  prototype_internal_builtin?: `${Capitalize<string>}Protocol`;
  swizzled_dynamic_property?: string;
}