import { Type } from "ts-morph";

function getPrototypeForPrimitiveBox(prototypePropertyType: Type<ts.Type>): string | undefined {
  const possiblePrimitiveBoxTypeName = prototypePropertyType.getText();
  switch (possiblePrimitiveBoxTypeName) {
  case "Number":
    return "rootSTable.sGlobalProtocols.NumberProtocol";
  default:
    return undefined;
  }
}

export function getPrototypeForObject(prototypePropertyType: Type<ts.Type>): string {
  if (prototypePropertyType.isInterface()) {
    const primitiveBox = getPrototypeForPrimitiveBox(prototypePropertyType);
    if (primitiveBox !== undefined) {
      return primitiveBox;
    } else {
      // todo
      return `new SValues.SNullValue(rootSTable.newMetadataForCompileTimeLiteral())`;
    }
  } else if (prototypePropertyType.isArray()) {
    // todo!
    return `new SValues.SNullValue(rootSTable.newMetadataForCompileTimeLiteral())`;
  } else {
    throw new Error(`Unexpected non-interface protocol ${prototypePropertyType.getText()}`);
  }
}