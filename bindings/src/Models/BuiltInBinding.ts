import { Type } from "ts-morph";

export class BuiltInBinding {
  readonly type: Type<ts.Type>
  entries: BindingEntry[] = [];

  constructor(type: Type<ts.Type>) {
    this.type = type;
  }
}

export class BindingEntry {
  readonly kind: "static" | "dynamic";
  readonly privateName: string
  globalVariableName?: string
  internalName?: string
  implementationCode: string;

  constructor(kind: "static" | "dynamic", privateName: string, implementationCode: string)  {
    this.privateName = "private_implementation_" + privateName;
    this.kind = kind;
    this.implementationCode = implementationCode;
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
