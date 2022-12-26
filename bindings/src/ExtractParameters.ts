import { Symbol as TSMSymbol } from "ts-morph";

export function extractParameters(parameterSymbols: TSMSymbol[]): ParamExtraction[] {
  const params: ParamExtraction[] = [];
  for (let i = 0; i < parameterSymbols.length; i++) {
    const sArgValue = `sArgArray[${i}]`;
    const parameterSymbol = parameterSymbols[i];
    const parameterType = parameterSymbol.getDeclaredType();
    let nativeArgValue: string;
    if (parameterType.isAny()) {
      nativeArgValue = sArgValue + ".getNativeJsValue(rootSTable)"
    } else {
      throw new Error("todo, support param type " + parameterType.getText());
    }
    params.push({
      setupCode: `${nativeArgValue}`,
      variableName: parameterSymbol.getName(),
      i: i,
    });
  }
  return params;
}


export interface ParamExtraction {
  setupCode: string
  variableName: string
  i: number
}