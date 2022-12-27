import { BindingEntry, ObjectImplementationModal } from "../Models/BuiltInBinding";
import { makeAppendToFileWithIndentationFunction } from "../FileWriting";
import { evenlyRemovingLeadingSpaces, isValidJsPropertyName } from "../Utils";

export function objectImplementationModelToCode(
  objectImplementationModal: ObjectImplementationModal
): string {
  let swizzleOrWhiteListModelStr = "";
  const appendToSwizzleOrWhiteListModelStrWithIndentation = makeAppendToFileWithIndentationFunction((str)=>swizzleOrWhiteListModelStr+=str);
  const appendToSwizzleOrWhiteListModelStr = appendToSwizzleOrWhiteListModelStrWithIndentation(2);
  // escapes if needed
  const makeSwizzleOrWhitelistProperty = (propertyName: string) => {
    if (isValidJsPropertyName(propertyName)) {
      return propertyName;
    } else {
      return `["${propertyName.replaceAll('"','\\"')}"]`;
    }
  };
  for (const swizzleOrWhiteListEntry of objectImplementationModal.swizzleOrWhiteListModel) {
    switch (swizzleOrWhiteListEntry.kind) {
    case "hardcoded":
      appendToSwizzleOrWhiteListModelStr(swizzleOrWhiteListEntry.code + ",");
      continue;
    case "whitelist":
      appendToSwizzleOrWhiteListModelStr(`${makeSwizzleOrWhitelistProperty(`whitelist_${swizzleOrWhiteListEntry.property}`)}: true,`);
      continue;
    case "swizzled_raw_apply":
      appendToSwizzleOrWhiteListModelStr(`
swizzled_apply_raw(sThisArg: SValue<any> | undefined, sArgArray: SValue<any>[], newTarget: undefined, sTable: SLocalSymbolTable<any>) {
  ${swizzleOrWhiteListEntry.code_body.trim().split("\n").join("\n  ")}
},`);
      continue;
    case "swizzled_raw_construct":
      appendToSwizzleOrWhiteListModelStr(`
swizzled_construct_raw(_: undefined, sArgArray, newTarget: SFunction<any>, sTable: SLocalSymbolTable<any>) {
  ${swizzleOrWhiteListEntry.code_body.trim().split("\n").join("\n  ")}
},`);
      continue;
    case "swizzled_static_property":
      appendToSwizzleOrWhiteListModelStr(`
${makeSwizzleOrWhitelistProperty(`swizzle_static_${swizzleOrWhiteListEntry.property}`)}: ${swizzleOrWhiteListEntry.code_body},
`);
      continue;
    default:
      console.log("TODO " + (swizzleOrWhiteListEntry as any).property);
    }
  }
  let proxiedValueCode: string = objectImplementationModal.mainRefGlobalVariableName;
  const sPrototype: string = objectImplementationModal.sPrototype ?? "new SValues.SNullValue(rootSTable.newMetadataForCompileTimeLiteral())";
  switch (objectImplementationModal.objectKind) {
  case "function":
    return `SValues.SFunction.createFromNative(
  ${proxiedValueCode},
  {
    ${swizzleOrWhiteListModelStr.trim()}
  },
  () => ${sPrototype},
  rootSTable.newMetadataForCompileTimeLiteral()
)`;
  case "plain":
    return `SValues.SNormalObject.createFromNative(
  ${proxiedValueCode},
  {
    ${swizzleOrWhiteListModelStr.trim()}
  },
  () => ${sPrototype},
  rootSTable.newMetadataForCompileTimeLiteral()
)`;
  }
}