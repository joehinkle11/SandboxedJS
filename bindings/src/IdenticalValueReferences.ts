



/// sometimes a single object can be access through multiple globals, i.e. `Object` is the same as `Object.prototype.constructor`.
/// we require these identical value references here so that the code gen logic can merge these


const identicalValueReferences: Partial<Record<string, string[]>> = {
  "Object": ["Object.prototype.constructor"],
};