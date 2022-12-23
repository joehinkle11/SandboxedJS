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
    this.typeTextSafe = this.typeText.replaceAll("[]","_array").replaceAll("<any>","_generic_any").replaceAll("<object>","_generic_object").replaceAll("<object, any>","_generic_object_or_any").replaceAll("<any, any>","_generic_any_or_any");
    this.sType = nativeTypeToSType(type);
  }

  getOrCreateSingletonEntry(implementationCode: string | undefined, privateNameOverride: string | undefined = undefined, sortOrder: number | undefined = undefined): BindingEntry {
    const privateName = "global_interface_" + (privateNameOverride?.replaceAll(".","_dot_") ?? this.typeTextSafe);
    for (const entry of this.entries) {
      if (entry.privateNameMatch(privateName)) {
        if (entry.implementationCode === undefined) {
          entry.implementationCode = implementationCode;
        }
        if (sortOrder !== undefined) {
          entry.sortOrder = Math.max(sortOrder, entry.sortOrder);
        }
        return entry;
      }
    }
    const entry = new BindingEntry(this, "static", privateName, implementationCode);
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
  implementationCode: string | undefined;
  globalVariableName?: string
  internalName?: string
  sortOrder: number;

  privateNameMatch(anotherPrivateName: string): boolean {
    return "private_implementation_" + anotherPrivateName === this.privateName;
  }

  constructor(builtInBinding: BuiltInBinding, kind: "static" | "dynamic", privateName: string, implementationCode: string | undefined)  {
    this.privateName = "private_implementation_" + privateName;
    this.kind = kind;
    this.implementationCode = implementationCode;
    this.sortOrder = 0;
    this.builtInBindingRef = new WeakRef(builtInBinding);
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
  getAllBindingEntries(): BindingEntry[] {
    const builtInBindingEntries: BindingEntry[] = [];
    for (const k in this.bindingsByType) {
      builtInBindingEntries.push(...(this.bindingsByType[k] as BuiltInBinding).entries);
    }
    return builtInBindingEntries;
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
