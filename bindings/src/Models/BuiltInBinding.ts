import type { Type } from "ts-morph";
import { nativeTypeToSType } from "../CodeGen/NativeTypeToSType";
import { objectImplementationModelToCode } from "../CodeGen/ObjectImplementationModelToCode";
import type { SwizzleOrWhiteListEntry } from "./Misc";

const cleanTypeText = (dirtyTypeTxt: string | undefined) => {
  if (dirtyTypeTxt === undefined) {
    return undefined;
  }
  return dirtyTypeTxt.replaceAll("readonly ","_readonly_").replaceAll("[]","_array").replaceAll("<any>","_generic_any").replaceAll("<object>","_generic_object").replaceAll("<object, any>","_generic_object_or_any").replaceAll("<any, any>","_generic_any_or_any").replaceAll(".","_dot_");
}
const removeGenericsInTypeStr = (typeTxt: string) => {
  return typeTxt.replaceAll("_T_","_any_");
}
const cleanTypeTextAndRemoveGenerics = (typeTxt: string) => {
  return removeGenericsInTypeStr("_" + cleanTypeText(typeTxt)!);
}


export class BindingEntry {
  readonly kind: "static" | "dynamic" ;
  readonly privateName: string
  implementationModal: ImplementationModal | undefined;
  globalVariableName?: string
  identicalGlobalVariableNames: string[] = [];
  internalName?: string
  sortOrder: number;

  generatedImplementationCode(): string {
    const implementationModal = this.implementationModal!;
    switch (implementationModal.implementation_kind) {
    case "hardcoded":
      return implementationModal.code;
    case "todo":
      return "undefined; // todo";
    case "object":
      return objectImplementationModelToCode(implementationModal);
    }
  }

  privateNameMatch(anotherPrivateName: string): boolean {
    return "private_implementation_" + anotherPrivateName === this.privateName;
  }

  constructor(kind: "static" | "dynamic", privateName: string, implementationModal: ImplementationModal | undefined)  {
    this.privateName = "private_implementation_" + privateName;
    this.kind = kind;
    this.implementationModal = implementationModal;
    this.sortOrder = 0;
  }
}

export class BuiltInBindingStore {
  entries: BindingEntry[] = [];

  getOrCreateVariableEntry(globalVariableName: string, implementationModal: ImplementationModal): BindingEntry {
    for (const entry of this.entries) {
      if (entry.globalVariableName === globalVariableName) {
        if (entry.implementationModal === undefined) {
          entry.implementationModal = implementationModal;
          return entry;
        } else {
          if (entry.implementationModal.implementation_kind === "object") {
            if (implementationModal.implementation_kind === "object") {
              const main = entry.implementationModal.mainRefGlobalVariableName;
              const main2 = implementationModal.mainRefGlobalVariableName;
              if (main !== main2) {
                throw new Error("Expected mains to match.")
              }
              let objectKind = implementationModal.objectKind;
              if (objectKind === "plain") {
                if (entry.implementationModal.objectKind === "function") {
                  objectKind = "function";
                }
              }
              entry.implementationModal = {
                implementation_kind: "object",
                mainRefGlobalVariableName: main,
                identicalValueRefVariableNames: Array.from(new Set([...entry.implementationModal.identicalValueRefVariableNames, ...implementationModal.identicalValueRefVariableNames])),
                objectKind: objectKind,
                sPrototype: implementationModal.sPrototype ?? entry.implementationModal.sPrototype,
                swizzleOrWhiteListModel: [...implementationModal.swizzleOrWhiteListModel, ...entry.implementationModal.swizzleOrWhiteListModel]
              }
              return entry;
            } 
          }
          throw new Error("Expected both implementation kinds to be object")
        }
      }
    }
    const entry = new BindingEntry("static", "global_" + globalVariableName, implementationModal);
    entry.globalVariableName = globalVariableName;
    this.entries.push(entry);
    return entry;
  }

  getOrCreateSingletonEntry(implementationModal: ImplementationModal | undefined, privateNameIn: string, sortOrder: number | undefined = undefined): BindingEntry {
    const privateNameWithGenerics = "global_interface_" + (cleanTypeText(privateNameIn));
    const privateName = removeGenericsInTypeStr(privateNameWithGenerics);
    for (const entry of this.entries) {
      if (entry.privateNameMatch(privateName)) {
        if (entry.implementationModal === undefined) {
          entry.implementationModal = implementationModal;
        }
        if (sortOrder !== undefined) {
          entry.sortOrder = Math.max(sortOrder, entry.sortOrder);
        }
        return entry;
      }
    }
    const entry = new BindingEntry("static", privateName, implementationModal);
    entry.sortOrder = sortOrder ?? 0;
    this.entries.push(entry);
    return entry;
  }
};

export type ImplementationModal = (HardcodedImplementationModal | ObjectImplementationModal | TodoImplementationModal) & {
  implementation_kind: string
};

export type HardcodedImplementationModal = {
  implementation_kind: "hardcoded"
  code: string
}
export type TodoImplementationModal = {
  implementation_kind: "todo"
}

export type ObjectImplementationModal = {
  implementation_kind: "object"
  swizzleOrWhiteListModel: SwizzleOrWhiteListEntry[]
  objectKind: "plain" | "function"
  mainRefGlobalVariableName: string
  identicalValueRefVariableNames: string[]
  sPrototype: string | undefined
}