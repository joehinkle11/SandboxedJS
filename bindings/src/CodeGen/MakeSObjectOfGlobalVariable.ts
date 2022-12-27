import { Signature, Type, TypeFormatFlags } from "ts-morph";
import { createStaticBindingCodeForGlobalVar } from "../BindingsCollectors/CollectVariables";
// import type { RefKind } from "../BindingsCollectors/CollectVariables";
import { blackListProperties } from "../Blacklist";
import { convertTypeToSValue, NativeToSValueConversionCode } from "../ConvertTypeToSValue";
import { extractParameters, ParamExtraction } from "../ExtractParameters";
import { ifIsIdenticalReferenceReturnMainRef } from "../IdenticalValueReferences";
import { BindingEntry, BuiltInBindingStore, ObjectImplementationModal } from "../Models/BuiltInBinding";
import { SwizzleOrWhiteListEntry } from "../Models/Misc";
import { overrides } from "../Overrides";
import { evenlyRemovingLeadingSpaces } from "../Utils";

const builtInBoxedPrimitiveTypes = ["Number", "Function", "Boolean", "String", "Object", "Symbol", "Array"];

export function makeSObjectOfGlobalVariable(
  globalVariableName: string,
  mainGlobalVariableName: string,
  nativeType: Type<ts.Type>,
  builtInBindingStore: BuiltInBindingStore,
  ourOrder: number
): ObjectImplementationModal {
  const nativeTypeStr = nativeType.getText();
  let sPrototype: string | undefined = undefined;
  const swizzleOrWhiteListModel: SwizzleOrWhiteListEntry[] = [];
  const addCallOrConstructSigs = (signature: Signature, isConstructor: boolean) => {
    const paramExtractionCodes: ParamExtraction[] = extractParameters(signature.getParameters());
    const returnType = signature.getReturnType();
    function makeSafeTypeText(type: Type<ts.Type>): string {
      if (type.getCallSignatures().length > 0) {
        return "any"
      } else if (type.isUnion() || type.isIntersection()) {
        return "any"
      } else if (type.isObject()) {
        return "any"
      }
      let safeTypeStr = (type.getTargetType() ?? type).getText(undefined, TypeFormatFlags.UseFullyQualifiedType).replaceAll("T[]","any[]").replaceAll("<K, V>", "<any, any>").replaceAll("<T>", "<any>");
      if (safeTypeStr === "T") {
        return "any";
      } else if (safeTypeStr === "this") {
        return makeSafeTypeText(nativeType);
      }
      return safeTypeStr;
    }
    const safeReturnTypeStr = makeSafeTypeText(returnType);
    const resultConversion: NativeToSValueConversionCode = convertTypeToSValue(returnType);
    let code: string;
    const override = overrides[globalVariableName]?.swizzled_apply_raw;
    if (override) {
      code = evenlyRemovingLeadingSpaces(override);
    } else {
      let callCode: string;
      let nativeArgsSetupStr = "";
      let nativeArgsStr = '[]';
      if (paramExtractionCodes.length > 0) {
        nativeArgsStr = 'nativeArgs';
        let nativeArgsSetupStrIndent = "";
        nativeArgsSetupStr = `const argsLength = sArgArray.length;
  const nativeArgs: any[] = [];`;
        for (const paramExtractionCode of paramExtractionCodes) {
          nativeArgsSetupStr += `
  if (argsLength > ${paramExtractionCode.i}) {
    // add param "${paramExtractionCode.variableName}" to call
    nativeArgs.push(${paramExtractionCode.setupCode});`.split("\n").join("\n" + nativeArgsSetupStrIndent);
          nativeArgsSetupStrIndent += "  ";
        }
        for (const _ of paramExtractionCodes) {
          nativeArgsSetupStrIndent = nativeArgsSetupStrIndent.replace("  ", "");
          nativeArgsSetupStr += "\n" + nativeArgsSetupStrIndent + "}"
        }
      }
      if (isConstructor) {
        // todo, third param "newTarget", see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct
        callCode = `Reflect.construct(${globalVariableName}, ${nativeArgsStr})`;
        // callCode = `new ${globalVariableName}(${paramExtractionCodes.map(v=>v.variableName).join(", ")})`;
      } else {
        callCode = `Reflect.apply(${globalVariableName}, sThisArg?.getNativeJsValue(rootSTable), ${nativeArgsStr})`;
      }
      code = `${nativeArgsSetupStr}
const result: ${safeReturnTypeStr} = ${callCode};
const sResult: ${resultConversion.resultingSType} = ${resultConversion.convert("result")};
return sResult;
`;
    }
    swizzleOrWhiteListModel.push({
      kind: isConstructor ? "swizzled_raw_construct" : "swizzled_raw_apply",
      code_body: code
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
    const globalRefToProperty = globalVariableName + "." + propertyName;
    if (propertyName.includes("_@")) {
      // todo: probably a property with a symbol as a key
      // console.log(`Skipping property '${propertyName}' as it is probably a symbol.`);
      continue;
    }
    if (blackListProperties.includes(propertyName)) {
      console.log(`Skipping property ${propertyName} on ${nativeTypeStr} as it is on the blacklist.`);
      continue;
    }
    const propertyDeclarations = typeProperty.getDeclarations();
    if (propertyDeclarations.length !== 1) {
      // console.log(`Handle more than 1 (or 0?) property declarations for whitelist/swizzling property ${propertyName}`)
      continue;
    }
    const propertyDeclaration = propertyDeclarations[0];
    const propertyType = propertyDeclaration.getType();
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
      if (propertyType.getText() === nativeTypeStr) {
        console.log("skipping",propertyName, propertyType.getText())
        continue;
      }
      const bindingOfPrototype = builtInBindingStore.getBindingForType(propertyType);
      let singletonProperty: BindingEntry;
      const mainRefToProperty = ifIsIdenticalReferenceReturnMainRef(globalRefToProperty);
      if (mainRefToProperty !== undefined) {
        console.log(`For property '${propertyName}' on ${globalVariableName}...implementation for ${globalRefToProperty} is skipped as it is just a duplicated reference to ${mainRefToProperty}.`); 
        singletonProperty = bindingOfPrototype.getOrCreateVariableEntry(mainRefToProperty, createStaticBindingCodeForGlobalVar(
          globalRefToProperty,
          mainRefToProperty,
          propertyType,
          builtInBindingStore,
          ourOrder + 1
        ));
      } else {
        singletonProperty = bindingOfPrototype.getOrCreateSingletonEntry(
          createStaticBindingCodeForGlobalVar(
            globalRefToProperty,
            globalRefToProperty,
            propertyType,
            builtInBindingStore,
            ourOrder + 1
          ),
          globalRefToProperty,
          ourOrder + 1
        );
        if (propertyName === "prototype") {
          if (builtInBoxedPrimitiveTypes.includes(globalVariableName)) {
            singletonProperty.internalName = globalVariableName + "Protocol";
          }
        }
      }
      swizzleOrWhiteListModel.push({
        kind: "swizzled_static_property",
        property: propertyName,
        code_body: singletonProperty.privateName
      });
      continue;
    }
  }
  if (globalVariableName === mainGlobalVariableName) {
    return {
      implementation_kind: "object",
      objectKind: objectKind,
      swizzleOrWhiteListModel: swizzleOrWhiteListModel,
      mainRefGlobalVariableName: globalVariableName,
      identicalValueRefVariableNames: [],
      sPrototype: sPrototype
    };
  } else {
    return {
      implementation_kind: "object",
      objectKind: objectKind,
      swizzleOrWhiteListModel: swizzleOrWhiteListModel,
      mainRefGlobalVariableName: mainGlobalVariableName,
      identicalValueRefVariableNames: [globalVariableName],
      sPrototype: sPrototype
    };
  }
}
