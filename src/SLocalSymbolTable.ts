import SUserError from "./Models/SUserError";
import type { SMetadataProvider } from "./SMetadataProvider";
import type { MaybeSValueMetadata, SValueMetadata } from "./SValueMetadata";
import { SValues } from "./SValues/AllSValues";
import { SNormalObject } from "./SValues/SObjects/SNormalObject";
import { convertAllPropertiesToSValues } from "./SValues/SObjects/SObjectValueImpl";
import { SUndefinedValue } from "./SValues/SPrimitiveValues/SUndefinedValue";
import type { SValue } from "./SValues/SValue";
import type { TranspileContext, ValueMetadataSystem } from "./TranspileContext";

type SymbolsRecord<M extends MaybeSValueMetadata> = Record<string, {
  kind: 'const' | 'let' | "var",
  value: SValue<M>
} | undefined>;

interface SGlobalProtocols<M extends MaybeSValueMetadata> {
  ObjectProtocol: SNormalObject<M>;
  FunctionProtocol: SNormalObject<M>;
  NumberProtocol: SNormalObject<M>;
  BooleanProtocol: SNormalObject<M>;
  // BoxNumber: (number: number, metadata: M) => SNormalObject<M>;
}

export class SLocalSymbolTable<M extends MaybeSValueMetadata> implements SMetadataProvider<M> {
  
  readonly transpileContext: TranspileContext<M>;
  metadata: M;

  readonly parent: SLocalSymbolTable<M> | null;
  readonly sGlobalProtocols: SGlobalProtocols<M>;
  readonly symbols: SymbolsRecord<M>;

  newMetadataForRuntimeTimeEmergingValue(): M {
    if (this.transpileContext.valueMetadataSystem === null) {
      return undefined as M;
    }
    return this.transpileContext.valueMetadataSystem.newMetadataForRuntimeTimeEmergingValue();
  }
  newMetadataForCompileTimeLiteral(): M {
    if (this.transpileContext.valueMetadataSystem === null) {
      return undefined as M;
    }
    return this.transpileContext.valueMetadataSystem.newMetadataForCompileTimeLiteral(this.metadata);
  }
  newMetadataForObjectValue(): M {
    if (this.transpileContext.valueMetadataSystem === null) {
      return undefined as M;
    }
    return this.transpileContext.valueMetadataSystem.newMetadataForObjectValue();
  }
  get valueMetadataSystem(): M extends SValueMetadata ? ValueMetadataSystem<M> : null {
    return this.transpileContext.valueMetadataSystem;
  }

  readonly sThis: SValue<M>;

  assign<V extends SValue<M>>(key: string, newValue: V, kind: 'const' | 'let' | "var" | "update"): V | SUndefinedValue<M> {
    const entry = this.symbols[key];
    switch (entry?.kind) {
    case "const":
    case "let":
    case "var":
      switch (kind) {
      case "const":
      case "let":
      case "var":
        this.symbols[key] = {
          kind: kind,
          value: newValue
        };
        return new SUndefinedValue(this.transpileContext.valueMetadataSystem?.newMetadataForRuntimeTimeEmergingValue());
      case "update":
        this.symbols[key] = {
          kind: "var",
          value: newValue
        };
        return newValue;
      }
    case undefined:
      switch (kind) {
      case "const":
      case "let":
      case "var":
        this.symbols[key] = {
          kind: kind,
          value: newValue
        };
        return new SUndefinedValue(this.transpileContext.valueMetadataSystem?.newMetadataForRuntimeTimeEmergingValue());
      case "update":
        this.symbols[key] = {
          kind: "var",
          value: newValue
        };
        return newValue;
      }
    }
  }
  sSet<T extends SValue<M>>(p: string, newValue: T, receiver: SValue<M>): T {
    this.assign(p, newValue, "update");
    return newValue;
  }
  sGet(p: string, receiver: SValue<M>, sTable: SLocalSymbolTable<M>): SValue<M> {
    const entry = this.symbols[p];
    if (entry !== undefined) {
      return entry.value;
    } else if (this.parent !== null) {
      return this.parent.sGet(p, receiver, sTable);
    } else {
      throw SUserError.symbolNotDefined(p);
    }
  }
  

  // creates the global symbol table
  private constructor(sThis: SValue<M>, symbols: SymbolsRecord<M>, parent: SLocalSymbolTable<M> | null, transpileContext: TranspileContext<M>) {
    this.transpileContext = transpileContext;
    this.parent = parent;
    this.metadata = transpileContext.newMetadataGlobalSymbolTable();
    this.symbols = symbols;
    this.sThis = sThis;
    this.sGlobalProtocols = parent?.sGlobalProtocols ?? {} as any;
  }

  spawnChild(
    sThis: SValue<M>,
    sArguments: any[] | undefined,
    argNames: string[] | undefined
  ): SLocalSymbolTable<M> {
    const symbolsInChild: SymbolsRecord<M> = {};
    if (sArguments !== undefined) {
      const arrayOfSValues = convertAllPropertiesToSValues({}, sArguments, this);
      const sPrototype = new SValues.SNullValue(this.newMetadataForRuntimeTimeEmergingValue()); // todo! should be object prototype?
      const args: SNormalObject<M> = SNormalObject.create(arrayOfSValues, sPrototype, this);
      symbolsInChild.arguments = {
        kind: "const",
        value: args
      };
      if (argNames !== undefined) {
        for (let index = 0; index < argNames.length; index++) {
          const sValue = arrayOfSValues[index];
          const argName = argNames[index];
          symbolsInChild[argName] = {
            kind: "const",
            value: sValue
          };
        }
      }
    }
    return new SLocalSymbolTable<M>(
      sThis,
      symbolsInChild,
      this,
      this.transpileContext
    );
  }

  // original and copy share same symbol table
  duplicateAndEraseMetadata(): SLocalSymbolTable<M> {
    return new SLocalSymbolTable<M>(this.sThis, this.symbols, this, this.transpileContext);
  }
  static createGlobal<M extends MaybeSValueMetadata>(transpileContext: TranspileContext<M>): SLocalSymbolTable<M> {
    return new SLocalSymbolTable<M>(new SUndefinedValue(transpileContext.valueMetadataSystem?.newMetadataForRuntimeTimeEmergingValue()), {}, null, transpileContext);
  }
}