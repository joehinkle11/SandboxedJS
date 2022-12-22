import { Type } from "ts-morph";




export function globalPrimitiveDeclaration(
  globalVariableName: string,
  declType: Type<ts.Type>,
  appendToFile: (appendStr: string) => void
) {
  appendToFile(`// do ${declType.getText()} for ${globalVariableName}`);
}