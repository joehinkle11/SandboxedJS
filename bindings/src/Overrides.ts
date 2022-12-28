

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
  "Symbol.prototype.description": {
    swizzled_dynamic_property: `
      {
        if (sValueWhichHoldsProperty instanceof SValues.SSymbolValue) {
          throw SUserError.requiredThisType("Symbol2");  
        }
        throw SUserError.requiredThisType("Symbol" + sValueWhichHoldsProperty.sValueKind);
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