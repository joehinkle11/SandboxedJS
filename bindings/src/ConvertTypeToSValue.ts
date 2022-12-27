import { Type } from "ts-morph";
import { STypeString } from "./CodeGen/NativeTypeToSType";

const specialObjectSupport: Record<string, ObjectSupport | undefined> = {
  Number: {
    sType: "SNormalObject<any>",
    nativeResultToSValueCode: "SValues.SNormalObject.exposeNativeBuiltIn<Number, any>(result, sTable.sGlobalProtocols.NumberProtocol, sTable.newMetadataForRuntimeTimeEmergingValue())"
  },
};


export function convertTypeToSValue(
  type: Type<ts.Type>,
  mProviderVariableName: string = "sTable"
): NativeToSValueConversionCode {
  const typeStr = type.getText();
  if (type.isNumber()) {
    return {
      resultingSType: "SNumberValue<any, number>",
      convert(nativeVariableName) {
        return `new SValues.SNumberValue(${nativeVariableName}, ${mProviderVariableName}.newMetadataForRuntimeTimeEmergingValue())`;
      },
    }
  } else if (type.isString()) {
    return {
      resultingSType: "SStringValue<any, string>",
      convert(nativeVariableName) {
        return `new SValues.SStringValue(${nativeVariableName}, ${mProviderVariableName}.newMetadataForRuntimeTimeEmergingValue())`;
      },
    }
  } else if (type.isBoolean()) {
    return {
      resultingSType: "SBooleanValue<any, boolean>",
      convert(nativeVariableName) {
        return `new SValues.SBooleanValue(${nativeVariableName}, ${mProviderVariableName}.newMetadataForRuntimeTimeEmergingValue())`;
      },
    }
  } else if (typeStr === "symbol") {
    return {
      resultingSType: "SSymbolValue<any, symbol>",
      convert(nativeVariableName) {
        return `new SValues.SSymbolValue(${nativeVariableName}, ${mProviderVariableName}.newMetadataForRuntimeTimeEmergingValue())`;
      },
    }
  } else {
    if (type.isObject()) {
      const typeText = type.getText();
      const objectSupport: ObjectSupport | undefined = specialObjectSupport[typeText];
      if (objectSupport !== undefined) {
        return {
          resultingSType: objectSupport.sType,
          convert(nativeVariableName) {
            return objectSupport.nativeResultToSValueCode;
          },
        }
      }
    }
    return {
      resultingSType: "never",
      convert(nativeVariableName) {
        return `(()=>{throw new Error("todo: convert return type '${type.getText().replaceAll('"','\\"')}' for '${nativeVariableName}'")})()`;
      },
    }
  }
}

export interface NativeToSValueConversionCode {
  resultingSType: STypeString | "never";
  convert: (nativeVariableName: string) => string;
}

interface ObjectSupport {
  sType: STypeString
  nativeResultToSValueCode: string
}