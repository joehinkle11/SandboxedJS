import { Type } from "ts-morph";

// const specialObjectSupport: Record<string, ObjectSupport | undefined> = {
//   Number: {
//     sType: "SNormalObject<any>",
//     nativeResultToSValueCode: "SValues.SNormalObject.exposeNativeBuiltIn<Number, any>(result, sTable.sGlobalProtocols.NumberProtocol, sTable.newMetadataForRuntimeTimeEmergingValue());"
//   },
// };


// export function convertTypeToSValue(
//   type: Type<ts.Type>,
//   mProviderVariableName: string = "sTable"
// ): NativeToSValueConversionCode {
//   if (type.isNumber()) {
//     return {
//       resultingSType: "SNumberValue<any, number>",
//       convert(nativeVariableName) {
//         return `new SValues.SNumberValue(${nativeVariableName}, ${mProviderVariableName}.newMetadataForRuntimeTimeEmergingValue())`;
//       },
//     }
//   } else {
//     if (type.isObject()) {
//       const typeText = type.getText();
//       const objectSupport: ObjectSupport | undefined = specialObjectSupport[typeText];
//       if (objectSupport !== undefined) {
//         return {
//           resultingSType: objectSupport.sType,
//           convert(nativeVariableName) {
//             return objectSupport.nativeResultToSValueCode;
//           },
//         }
//       }
//     }
//     return {
//       resultingSType: "never",
//       convert(nativeVariableName) {
//         return `(()=>{throw new Error("todo: convert return type '${type.getText()}'")})()`;
//       },
//     }
//   }
// }

// export interface NativeToSValueConversionCode {
//   resultingSType: string;
//   convert: (nativeVariableName: string) => string;
// }

// interface ObjectSupport {
//   sType: string
//   nativeResultToSValueCode: string
// }