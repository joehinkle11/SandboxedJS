
import { Project } from "ts-morph";
import { BuiltInBindingStore } from "./Models/BuiltInBinding";
import { collectVariables } from "./BindingsCollectors/CollectVariables";
import { collectInterfaces } from "./BindingsCollectors/CollectInterfaces";
import { exportToFile } from "./ExportToFile";
import { importTSLibFilesRecursively } from "./ImportTSLibFilesRecursively";

const project = new Project({
  tsConfigFilePath: "./src/target.tsconfig.json"
});

const target = "lib.es2022.d.ts";
// const target = "lib.d.ts";
// const target = "lib.es5.d.ts";

const filesToDoWorkOn = importTSLibFilesRecursively(target, project);

let builtInBindingStore: BuiltInBindingStore = new BuiltInBindingStore();
collectInterfaces(filesToDoWorkOn, builtInBindingStore);
collectVariables(filesToDoWorkOn, builtInBindingStore);

exportToFile(builtInBindingStore);

/*
function addFileGlobalVariables(filePath: string) {
  const file = project.getSourceFileOrThrow(filePath);
  const decls = file.getVariableDeclarations();
  for (const decl of decls) {
    const globalVariableName = decl.getStructure().name;
    const declType = decl.getType();
    if (declType.isNumber() || declType.isBoolean() || declType.isLiteral() || declType.isNull() || declType.isString() || declType.isUndefined() ) {
      globalPrimitiveDeclaration(
        globalVariableName,
        declType,
        appendToFile
      );
      continue;
    } else if (declType.isObject() === false) {
      // throw new Error("todo " + declType.getText());
      continue;
    }
    const isNormalCallable = declType.getCallSignatures().length > 0;
    const isConstructCallable = declType.getConstructSignatures().length > 0;
    // if ((isNormalCallable || isConstructCallable) === false) {
    // TODO: support creating bindings for things which are only normal callable or only construct callable
    if ((isNormalCallable && isConstructCallable) === false) {
      continue;
    }
    const swizzleOrWhiteListModel: SwizzleOrWhiteListEntry[] = [];
    const addCallOrConstructSigs = (signature: Signature, isConstructor: boolean) => {
      const paramExtractionCodes: ParamExtraction[] = extractParameters(signature.getParameters());
      const returnType = signature.getReturnType();
      const resultConversion: NativeToSValueConversionCode = convertTypeToSValue(returnType);
      swizzleOrWhiteListModel.push({
        kind: isConstructor ? "swizzled_raw_construct" : "swizzled_raw_apply",
        code_body: `${paramExtractionCodes.map(v=>v.setupCode).join("\n")}
const result: ${returnType.getText(undefined, TypeFormatFlags.UseFullyQualifiedType)} = ${isConstructor ? "new " : ""}${globalVariableName}(${paramExtractionCodes.map(v=>v.variableName).join(", ")});
const sResult: ${resultConversion.resultingSType} = ${resultConversion.convert("result")};
return sResult;
`
      })
    };
    const callSignatures = declType.getCallSignatures();
    if (callSignatures.length > 0) {
      // if (callSignatures.length > 1) {
      //   throw new Error(`Unexpectedly found more than 1 call signature. ${declType.getText()} ${callSignatures.map(v=>v.getDeclaration().getText())}`)
      // }
      const callSignature = callSignatures[0];
      addCallOrConstructSigs(callSignature, false);
    }
    const constructSignatures = declType.getConstructSignatures();
    if (constructSignatures.length > 0) {
      // if (constructSignatures.length > 1) {
      //   throw new Error("Unexpectedly found more than 1 construct signature.")
      // }
      const constructSignature = constructSignatures[0];
      addCallOrConstructSigs(constructSignature, true);
    }
    let sPrototype = "new SValues.SNullValue(rootSTable.newMetadataForCompileTimeLiteral())";
    const typeProperties = declType.getProperties();
    for (const typeProperty of typeProperties) {
      const propertyName = typeProperty.getName();
      const propertyDeclarations = typeProperty.getDeclarations();
      if (propertyDeclarations.length !== 1) {
        console.log(`Handle more than 1 (or 0?) property declarations for whitelist/swizzling property ${propertyName}`)
        continue;
      }
      const propertyDeclaration = propertyDeclarations[0];
      const propertyType = propertyDeclaration.getType();
      if (propertyName === "prototype") {
        sPrototype = getPrototypeForObject(propertyType);
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
          console.log(`Handle non-primitive whitelist/swizzling property ${propertyName} of type ${propertyType.getText()}`);
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
    appendToFile(`
/// Native binding to global variable "${globalVariableName}".
rootSTable.assign("${globalVariableName}", SValues.SFunction.createFromNative(
  ${globalVariableName},
  {
    ${swizzleOrWhiteListModelStr.trim()}
  },
  () => ${sPrototype},
  rootSTable.newMetadataForCompileTimeLiteral()
), "const");
`);
  }
}

function addFileGlobalPrototypes(filePath: string) {
  const file = project.getSourceFileOrThrow(filePath);
  const interfaces = file.getInterfaces();
  for (const anInterface of interfaces) {
    addGlobalPrototypeObject(anInterface, appendToFile);
  }
}
*/





// project.createSourceFile("test.ts",`let w = Number.NaN`);
// const sourceFile = project.getSourceFiles()[0];
// console.log(sourceFile.getVariableDeclarationOrThrow("w").getType().getText());