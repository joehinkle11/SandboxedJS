import { MaybeSValueMetadata, SValueMetadata } from "./SValueMetadata";
import { SValue } from "./SValues";

export interface RunnerBuiltIns {
  /** Default true */
  ecmaScript?: boolean,
  // custom: Record<string, CustomBuiltIn>
}
export interface TranspileContextSetup<M extends MaybeSValueMetadata> {
  builtIns: RunnerBuiltIns,
  valueMetadataSystem: M extends SValueMetadata ? ValueMetadataSystem<M> : null
}

export class TranspileContext<M extends MaybeSValueMetadata> {
  valueMetadataSystem: M extends SValueMetadata ? ValueMetadataSystem<any> : null
  lastParsedJs: string = "";

  constructor(params: TranspileContextSetup<M>) {
    this.valueMetadataSystem = params.valueMetadataSystem;
  }

  newMetadataJsCodeForCompileTimeLiteral(): string {
    if (this.valueMetadataSystem === null) {
      return "";
    }
    return ",sTable.newMetadataForCompileTimeLiteral()";
  }
  newMetadataGlobalSymbolTable(): M {
    if (this.valueMetadataSystem === null) {
      return undefined as M;
    }
    return this.valueMetadataSystem.newMetadataGlobalSymbolTable() as M;
  }
}

export interface ValueMetadataSystem<MetaDataModel extends SValueMetadata> {
  newMetadataForCompileTimeLiteral(currentScopeMetadata: MetaDataModel): MetaDataModel;
  newMetadataForRuntimeTimeEmergingValue(): MetaDataModel;
  newMetadataForObjectValue(): MetaDataModel;
  newMetadataGlobalSymbolTable(): MetaDataModel;
  newMetadataForCombiningValues(left: SValue<MetaDataModel>, right: SValue<MetaDataModel>): MetaDataModel;
}