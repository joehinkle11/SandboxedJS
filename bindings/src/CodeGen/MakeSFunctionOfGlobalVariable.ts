import { Type } from "ts-morph";

export function makeSFunctionOfGlobalVariable(
  globalVariableName: string,
  nativeType: Type<ts.Type>
): string {
  let sPrototype = "new SValues.SNullValue(rootSTable.newMetadataForCompileTimeLiteral())";
  let swizzleOrWhiteListModelStr = "";
  return `SValues.SFunction.createFromNative(
  ${globalVariableName},
  {
    ${swizzleOrWhiteListModelStr.trim()}
  },
  () => ${sPrototype},
  rootSTable.newMetadataForCompileTimeLiteral()
)`;
}