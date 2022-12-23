import { Type } from "ts-morph";
import { nativeTypeToSType } from "../CodeGen/NativeTypeToSType";

export class BuiltInBinding {
  readonly type: Type<ts.Type>
  readonly typeText: string;
  readonly typeTextSafe: string;
  readonly sType: string;
  entries: BindingEntry[] = [];

  constructor(type: Type<ts.Type>) {
    this.type = type;
    this.typeText = this.type.getText();
    this.typeTextSafe = this.typeText.replaceAll("[]","_array")
    this.sType = nativeTypeToSType(type);
  }

  getOrCreateSingletonEntry(implementationCode: string | undefined): BindingEntry {
    const privateName = "global_interface_" + this.typeTextSafe;
    for (const entry of this.entries) {
      if (entry.privateNameMatch(privateName)) {
        if (entry.implementationCode === undefined) {
          entry.implementationCode = implementationCode;
        }
        return entry;
      }
    }
    const entry = new BindingEntry("static", privateName, implementationCode);
    this.entries.push(entry);
    return entry;
  }
}

export class BindingEntry {
  readonly kind: "static" | "dynamic" ;
  readonly privateName: string
  implementationCode: string | undefined;
  globalVariableName?: string
  internalName?: string

  privateNameMatch(anotherPrivateName: string): boolean {
    return "private_implementation_" + anotherPrivateName === this.privateName;
  }

  constructor(kind: "static" | "dynamic", privateName: string, implementationCode: string | undefined)  {
    this.privateName = "private_implementation_" + privateName;
    this.kind = kind;
    this.implementationCode = implementationCode;
  }
}

export class BuiltInBindingStore {
  protected bindingsByType: Partial<Record<string, BuiltInBinding>>
  // protected bindingsByGlobalVariableName

  getAllBindings(): BuiltInBinding[] {
    const builtInBindings: BuiltInBinding[] = [];
    for (const k in this.bindingsByType) {
      builtInBindings.push(this.bindingsByType[k] as BuiltInBinding);
    }
    return builtInBindings;
  }

  getBindingForType(type: Type<ts.Type>): BuiltInBinding {
    const existing = this.bindingsByType[type.getText()];
    if (existing) {
      return existing;
    }
    const newBinding = new BuiltInBinding(type);
    this.bindingsByType[type.getText()] = newBinding;
    return newBinding;
  }

  constructor() {
    this.bindingsByType = {};
  }
};
