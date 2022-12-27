

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
    swizzled_lookup_private_var_name: "private_implementation_global_Object"
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
  "Object": {
    prototype_internal_builtin: "FunctionProtocol",
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
};

type OverrideEntry = {
  swizzled_apply_raw?: string;
  swizzled_lookup_private_var_name?: string;
  prototype_internal_builtin?: `${Capitalize<string>}Protocol`
}