import SUserError from "./Models/SUserError";
import { MaybeSValueMetadata } from "./SValueMetadata";
import { SUndefinedValue, SValue } from "./SValues";
import { TranspileContext } from "./TranspileContext";

type SymbolsRecord<M extends MaybeSValueMetadata> = Record<string, {
  kind: 'const' | 'let' | "var",
  value: SValue<M>
} | undefined>;

export class SLocalSymbolTable<M extends MaybeSValueMetadata> {
  
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
    return this.transpileContext.valueMetadataSystem!.newMetadataForCompileTimeLiteral(this.metadata);
  }
  newMetadataForObjectValue(): M {
    if (this.transpileContext.valueMetadataSystem === null) {
      return undefined as M;
    }
    return this.transpileContext.valueMetadataSystem.newMetadataForObjectValue();
  }

  readonly sThis: SValue<M>;

  assign<V extends SValue<M>>(key: string, newValue: V, kind: 'const' | 'let' | "var" | "update", receiver: SValue<M> | undefined = undefined): V | SUndefinedValue<M> {
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
      return new SUndefinedValue(this.transpileContext.valueMetadataSystem?.newMetadataForRuntimeTimeEmergingValue());
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

  spawnChild(sThis: SValue<M>): SLocalSymbolTable<M> {
    return new SLocalSymbolTable<M>(sThis, {}, this, this.transpileContext);
  }

  // original and copy share same symbol table
  duplicateAndEraseMetadata(): SLocalSymbolTable<M> {
    return new SLocalSymbolTable<M>(this.sThis, this.symbols, this, this.transpileContext);
  }
  static createGlobal<M extends MaybeSValueMetadata>(transpileContext: TranspileContext<M>): SLocalSymbolTable<M> {
    return new SLocalSymbolTable<M>(new SUndefinedValue(transpileContext.valueMetadataSystem?.newMetadataForRuntimeTimeEmergingValue()), {}, null, transpileContext);
  }
}