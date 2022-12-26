

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
};

type OverrideEntry = {
  swizzled_apply_raw?: string;
}