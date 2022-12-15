import { MaybeSValueMetadata } from "./SValueMetadata";
import { SValue } from "./SValues";
import { TranspileContext } from "./TranspileContext";

export class SLocalSymbolTable<M extends MaybeSValueMetadata> {
  
  readonly transpileContext: TranspileContext<M>;
  metadata: M;

  readonly parent: SLocalSymbolTable<M> | null;
  readonly symbols: Record<string, SValue<M>>;

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

  assign(key: string, newValue: SValue<M>, receiver: SValue<M>) {

  }

  // creates the global symbol table
  private constructor(symbols: Record<string, SValue<M>>, parent: SLocalSymbolTable<M> | null, transpileContext: TranspileContext<M>) {
    this.transpileContext = transpileContext;
    this.parent = parent;
    this.metadata = transpileContext.newMetadataGlobalSymbolTable();
    this.symbols = symbols;
  }

  spawnChild(): SLocalSymbolTable<M> {
    return new SLocalSymbolTable<M>({}, this, this.transpileContext);
  }

  // original and copy share same symbol table
  duplicateAndEraseMetadata(): SLocalSymbolTable<M> {
    return new SLocalSymbolTable<M>(this.symbols, this, this.transpileContext);
  }
  static createGlobal<M extends MaybeSValueMetadata>(transpileContext: TranspileContext<M>): SLocalSymbolTable<M> {
    return new SLocalSymbolTable<M>({}, null, transpileContext);
  }
}