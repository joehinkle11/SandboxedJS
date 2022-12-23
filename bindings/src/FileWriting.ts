import fs from 'fs';

let outputFilePath = "../src/gen/Bindings_Generated.ts";
fs.writeFileSync(outputFilePath, "");
export const fileStream = fs.createWriteStream(outputFilePath);

export const makeAppendToFileWithIndentationFunction = (writeFunc: (appendStr: string) => void) => {
  return (indentation: number) => {
    let indentationStr = "";
    for (let index = 0; index < indentation; index++) {
      indentationStr += "  ";
    }
    const writeFuncWithIndent = (appendStr: string) => {
      const pieces = appendStr.trim().split("\n");
      for (const piece of pieces) {
        writeFunc("\n" + indentationStr + piece);
      }
    };
    // todo
    // writeFunc.increaseIndentation = (increaseAmt: number = 1) => {
    //   return 
    // }
    return writeFuncWithIndent;
  };
};