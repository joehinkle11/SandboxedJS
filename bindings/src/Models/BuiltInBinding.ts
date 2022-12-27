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

export class BuiltInBinding {
  readonly type: Type<ts.Type>
  readonly typeText: string;
  readonly typeTextSafe: string;
  readonly sType: string;
  readonly id: string = (Math.round(Math.random() * 100000)).toString();
  entries: BindingEntry[] = [];

  constructor(type: Type<ts.Type>) {
    this.type = type;
    this.typeText = this.type.getText();
    this.typeTextSafe = cleanTypeText(this.typeText)!;
    this.sType = nativeTypeToSType(type);
  }

  getOrCreateVariableEntry(globalVariableName: string, implementationModal: ImplementationModal): BindingEntry {
    for (const entry of this.entries) {
      if (entry.globalVariableName === globalVariableName) {
        if (entry.implementationModal === undefined) {
          entry.implementationModal = implementationModal;
        } else {
          throw new Error("MERGE")
        }
        return entry;
      }
    }
    const entry = new BindingEntry(this, "static", "global_" + globalVariableName, implementationModal);
    entry.globalVariableName = globalVariableName;
    this.entries.push(entry);
    return entry;
  }

  getOrCreateSingletonEntry(implementationModal: ImplementationModal | undefined, privateNameOverride: string | undefined = undefined, sortOrder: number | undefined = undefined): BindingEntry {
    const privateNameWithGenerics = "global_interface_" + (cleanTypeText(privateNameOverride) ?? this.typeTextSafe);
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
    const entry = new BindingEntry(this, "static", privateName, implementationModal);
    entry.sortOrder = sortOrder ?? 0;
    this.entries.push(entry);
    return entry;
  }
}

export class BindingEntry {
  readonly kind: "static" | "dynamic" ;
  readonly privateName: string
  readonly builtInBindingRef: WeakRef<BuiltInBinding>;
  get builtInBinding(): BuiltInBinding { return this.builtInBindingRef.deref()! };
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
    case "object":
      return objectImplementationModelToCode(implementationModal);
    }
  }

  privateNameMatch(anotherPrivateName: string): boolean {
    return "private_implementation_" + anotherPrivateName === this.privateName;
  }

  constructor(builtInBinding: BuiltInBinding, kind: "static" | "dynamic", privateName: string, implementationModal: ImplementationModal | undefined)  {
    this.privateName = "private_implementation_" + privateName;
    this.kind = kind;
    this.implementationModal = implementationModal;
    this.sortOrder = 0;
    this.builtInBindingRef = new WeakRef(builtInBinding);
  }
}

export class BuiltInBindingStore {
  protected bindingsByType: Partial<Record<string, BuiltInBinding>>

  getAllBindings(): BuiltInBinding[] {
    const builtInBindings: BuiltInBinding[] = [];
    for (const k in this.bindingsByType) {
      builtInBindings.push(this.bindingsByType[k] as BuiltInBinding);
    }
    return builtInBindings;
  }
  getAllBindingEntries(): BindingEntry[] {
    const builtInBindingEntries: BindingEntry[] = [];
    for (const k in this.bindingsByType) {
      builtInBindingEntries.push(...(this.bindingsByType[k] as BuiltInBinding).entries);
    }
    return builtInBindingEntries;
  }

  getBindingForType(type: Type<ts.Type>): BuiltInBinding {
    const typeStr = cleanTypeTextAndRemoveGenerics(type.getText());
    const existing = this.bindingsByType[typeStr];
    if (existing) {
      return existing;
    }
    const newBinding = new BuiltInBinding(type);
    this.bindingsByType[typeStr] = newBinding;
    return newBinding;
  }

  constructor() {
    this.bindingsByType = {};
  }
};

export type ImplementationModal = (HardcodedImplementationModal | ObjectImplementationModal) & {
  implementation_kind: string
};

export type HardcodedImplementationModal = {
  implementation_kind: "hardcoded"
  code: string
}

export type ObjectImplementationModal = {
  implementation_kind: "object"
  swizzleOrWhiteListModel: SwizzleOrWhiteListEntry[]
  objectKind: "plain" | "function"
  mainRefGlobalVariableName: string
  identicalValueRefVariableNames: string[]
  sPrototype: string | undefined
}