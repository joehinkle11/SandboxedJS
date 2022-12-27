
import { Project } from "ts-morph";
import { BuiltInBindingStore } from "./Models/BuiltInBinding";
import { collectGlobals } from "./BindingsCollectors/CollectGlobals";
// import { collectInterfaces } from "./BindingsCollectors/CollectVariables";
import { exportToFile } from "./ExportToFile";
import { importTSLibFilesRecursively } from "./ImportTSLibFilesRecursively";

const project = new Project({
  tsConfigFilePath: "./src/target.tsconfig.json"
});

const target = "lib.es2022.d.ts";
// const target = "lib.d.ts";
// const target = "lib.es5.d.ts";

// If you need to generate both global and local definitions
const globalAndLocalExtraHardcodedTypeDefs = `
interface Boolean {
  toString(): string;
}
interface ObjectConstructor extends Function {}
`;

// It seems some of typescript's default definitions missed some things, add them here to get auto-generated bindings.
const extraHardcodedTypeDefs = `
declare global {
  ${globalAndLocalExtraHardcodedTypeDefs.split("\n").join("\n  ").trim()}
}
${globalAndLocalExtraHardcodedTypeDefs.trim()}
`;

const filesToDoWorkOn = importTSLibFilesRecursively(target, project);
filesToDoWorkOn.push(project.createSourceFile("extra_hardcoded_type_defs.d.ts", extraHardcodedTypeDefs));


let builtInBindingStore: BuiltInBindingStore = new BuiltInBindingStore();
// collectInterfaces(filesToDoWorkOn, builtInBindingStore);
collectGlobals(filesToDoWorkOn, builtInBindingStore);

exportToFile(builtInBindingStore, extraHardcodedTypeDefs);