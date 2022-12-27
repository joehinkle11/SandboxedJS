



/// sometimes a single object can be access through multiple globals, i.e. `Object` is the same as `Object.prototype.constructor`.
/// we require these identical value references here so that the code gen logic can merge these


const identicalValueReferences: Partial<Record<string, string[]>> = {
  "Object": ["Object.prototype.constructor"],
};

export function ifIsIdenticalReferenceReturnMainRef(varName: string): string | undefined {
  for(const mainRef of Object.keys(identicalValueReferences)) {
    const otherRefs = identicalValueReferences[mainRef]!;
    if (otherRefs.includes(varName)) {
      return mainRef;
    }
  }
  return undefined;
}

export function getIdenticalReferencesFor(varName: string): string[] {
  return identicalValueReferences[varName] ?? [];
}