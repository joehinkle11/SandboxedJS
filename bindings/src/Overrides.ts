

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
  "Object.getOwnPropertyNames": {
    swizzled_apply_raw: `
      const firstArgObj = sArgArray[0]?.sConvertToObject(sTable);
      if (firstArgObj) {
        return firstArgObj.sOwnKeys(sTable);
      }
      throw SUserError.cannotConvertToObject;
      `
  },
};

type OverrideEntry = {
  swizzled_apply_raw?: string;
}