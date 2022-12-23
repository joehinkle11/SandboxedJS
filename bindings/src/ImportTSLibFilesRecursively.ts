import { Project, SourceFile } from "ts-morph";


export function importTSLibFilesRecursively(
  targetPath: string,
  project: Project
): SourceFile[] {
  const loadedFiles: string[] = [];
  const filesToDoWorkOn: SourceFile[] = [];
  function importFileRecursively(fileName: string) {
    const filePath = "./src/tslib/" + fileName;
    console.log("Importing " + filePath);
    project.addSourceFileAtPath(filePath);
    const file = project.getSourceFileOrThrow(filePath);
    if (loadedFiles.includes(filePath) === false) {
      loadedFiles.push(filePath);
      filesToDoWorkOn.push(file);
    }
    const libReferenceDirectives = file.getLibReferenceDirectives();
    for (const libReferenceDirective of libReferenceDirectives) {
      const fileName = "lib." + libReferenceDirective.getFileName() + ".d.ts";
      importFileRecursively(fileName);
    }
  }
  importFileRecursively(targetPath);
  return filesToDoWorkOn;
}
