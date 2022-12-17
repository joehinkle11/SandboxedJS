import SUserError from "./Models/SUserError";
import { SMetadataProvider } from "./SMetadataProvider";
import { MaybeSValueMetadata, SValueMetadata } from "./SValueMetadata";
import { convertAllPropertiesToSValues, SNormalObject, SNumberValue, SObjectValue, SUndefinedValue, SValue } from "./SValues";
import { TranspileContext, ValueMetadataSystem } from "./TranspileContext";

type SymbolsRecord<M extends MaybeSValueMetadata> = Record<string, {
  kind: 'const' | 'let' | "var",
  value: SValue<M>
} | undefined>;

export class SLocalSymbolTable<M extends MaybeSValueMetadata> implements SMetadataProvider<M> {
  
  readonly transpileContext: TranspileContext<M>;
  metadata: M;

  readonly parent: SLocalSymbolTable<M> | null;
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
  }

  spawnChild(
    sThis: SValue<M>,
    sArguments: any[] | undefined,
    argNames: string[] | undefined
  ): SLocalSymbolTable<M> {
    const symbolsInChild: SymbolsRecord<M> = {};
    if (sArguments !== undefined) {
      const arrayOfSValues = convertAllPropertiesToSValues({}, sArguments, this);
      const args: SNormalObject<M> = new SNormalObject(arrayOfSValues, this);
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