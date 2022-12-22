import { Type } from "ts-morph";


export function convertTypeToSValue(
  type: Type<ts.Type>,
  mProviderVariableName: string = "sTable"
): NativeToSValueConversionCode {
  if (type.isNumber()) {
    return {
      resultingSType: "SNumberValue<any, number>",
      convert(nativeVariableName) {
        return `new SValues.SNumberValue(${nativeVariableName}, ${mProviderVariableName}.newMetadataForRuntimeTimeEmergingValue())`;
      },
    }
  } else {
    return {
      resultingSType: "never",
      convert(nativeVariableName) {
        return `(()=>{throw new Error("todo: convert return type '${type.getText()}'")})()`;
      },
    }
  }
}

export interface NativeToSValueConversionCode {
  resultingSType: string;
  convert: (nativeVariableName: string) => string;
}