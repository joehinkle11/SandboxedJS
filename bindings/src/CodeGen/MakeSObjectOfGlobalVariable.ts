import { Signature, SyntaxKind, Type, TypeFormatFlags } from "ts-morph";
import { createStaticBindingCodeForGlobalVar } from "../BindingsCollectors/CollectVariables";
import { convertTypeToSValue, NativeToSValueConversionCode } from "../ConvertTypeToSValue";
import { extractParameters, ParamExtraction } from "../ExtractParameters";
import { makeAppendToFileWithIndentationFunction } from "../FileWriting";
import { BuiltInBindingStore } from "../Models/BuiltInBinding";
import { SwizzleOrWhiteListEntry } from "../Models/Misc";
import { isValidJsPropertyName } from "../Utils";

export function makeSObjectOfGlobalVariable(
  globalVariableName: string,
  nativeType: Type<ts.Type>,
  builtInBindingStore: BuiltInBindingStore
): string {
  let sPrototype = "new SValues.SNullValue(rootSTable.newMetadataForCompileTimeLiteral())";
  const swizzleOrWhiteListModel: SwizzleOrWhiteListEntry[] = [];
  const addCallOrConstructSigs = (signature: Signature, isConstructor: boolean) => {
    const paramExtractionCodes: ParamExtraction[] = extractParameters(signature.getParameters());
    const returnType = signature.getReturnType();
    const returnTypeStr = returnType.getText(undefined, TypeFormatFlags.UseFullyQualifiedType);
    let safeReturnTypeStr = (returnType.getTargetType() ?? returnType).getText(undefined, TypeFormatFlags.UseFullyQualifiedType).replaceAll("T[]","any[]").replaceAll("<K, V>", "<any, any>").replaceAll("<T>", "<any>");
    if (safeReturnTypeStr === "T") {
      safeReturnTypeStr = "any";
    }
    const resultConversion: NativeToSValueConversionCode = convertTypeToSValue(returnType);
    swizzleOrWhiteListModel.push({
      kind: isConstructor ? "swizzled_raw_construct" : "swizzled_raw_apply",
      code_body: `${paramExtractionCodes.map(v=>v.setupCode).join("\n")}
const result: ${safeReturnTypeStr} = ${isConstructor ? "new " : ""}${globalVariableName}(${paramExtractionCodes.map(v=>v.variableName).join(", ")});
const sResult: ${resultConversion.resultingSType} = ${resultConversion.convert("result")};
return sResult;
`
    });
  };
  let objectKind: "plain" | "function" | "array" = "plain";
  const callSignatures = nativeType.getCallSignatures();
  const constructSignatures = nativeType.getConstructSignatures();
  if (callSignatures.length > 0) {
    objectKind = "function";
    // if (callSignatures.length > 1) {
    //   throw new Error(`Unexpectedly found more than 1 call signature. ${declType.getText()} ${callSignatures.map(v=>v.getDeclaration().getText())}`)
    // }
    const callSignature = callSignatures[0];
    addCallOrConstructSigs(callSignature, false);
    if (constructSignatures.length === 0) {
      swizzleOrWhiteListModel.push({
        kind: "swizzled_raw_construct",
        code_body: `throw SUserError.requiresNew("${globalVariableName}");`
      });
    }
  }
  if (constructSignatures.length > 0) {
    objectKind = "function";
    // if (constructSignatures.length > 1) {
    //   throw new Error("Unexpectedly found more than 1 construct signature.")
    // }
    const constructSignature = constructSignatures[0];
    addCallOrConstructSigs(constructSignature, true);
    if (callSignatures.length === 0) {
      swizzleOrWhiteListModel.push({
        kind: "swizzled_raw_apply",
        code_body: `throw SUserError.notAConstructor("${globalVariableName}");`
      });
    }
  }
  const typeProperties = nativeType.getProperties();
    for (const typeProperty of typeProperties) {
      const propertyName = typeProperty.getName();
      if (propertyName.includes("_@")) {
        // todo: probably a property with a symbol as a key
        console.log(`Skipping property '${propertyName}' as it is probably a symbol.`);
        continue;
      }
      const propertyDeclarations = typeProperty.getDeclarations();
      if (propertyDeclarations.length !== 1) {
        // console.log(`Handle more than 1 (or 0?) property declarations for whitelist/swizzling property ${propertyName}`)
        continue;
      }
      const propertyDeclaration = propertyDeclarations[0];
      const propertyType = propertyDeclaration.getType();
      if (propertyName === "prototype") {
        const bindingOfPrototype = builtInBindingStore.getBindingForType(propertyType);
        const singletonPrototype = bindingOfPrototype.getOrCreateSingletonEntry(
          createStaticBindingCodeForGlobalVar(
            globalVariableName + ".prototype",
            propertyType,
            builtInBindingStore
          )
        );
        sPrototype = singletonPrototype.privateName;
        continue;
      } else {
        // is a primitive
        if (propertyType.isBoolean() || propertyType.isNumber() || propertyType.isUndefined() || propertyType.isNull() || propertyType.isString()) {
          // whitelist it!
          // todo: force the user who is generating the bindings to opt-in to white listing for safety
          swizzleOrWhiteListModel.push({
            kind: "whitelist",
            property: propertyName
          });
          continue;
        } else {
          // console.log(`Handle non-primitive whitelist/swizzling property ${propertyName} of type ${propertyType.getText()}`);
          continue;
        }
      }
    }
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
  for (const swizzleOrWhiteListEntry of swizzleOrWhiteListModel) {
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
    default:
      console.log("TODO " + (swizzleOrWhiteListEntry as any).property);
    }
  }
  switch (objectKind) {
  case "function":
    return `SValues.SFunction.createFromNative(
  ${globalVariableName},
  {
    ${swizzleOrWhiteListModelStr.trim()}
  },
  () => ${sPrototype},
  rootSTable.newMetadataForCompileTimeLiteral()
)`;
  case "plain":
    return `SValues.SNormalObject.createFromNative(
  ${globalVariableName},
  {
    ${swizzleOrWhiteListModelStr.trim()}
  },
  () => ${sPrototype},
rootSTable.newMetadataForCompileTimeLiteral()
)`;
  }
}
