import SUserError from "./Models/SUserError";
import type { ExposedGlobal } from "./Runner";
import type { SMetadataProvider } from "./SMetadataProvider";
import type { MaybeSValueMetadata, SValueMetadata } from "./SValueMetadata";
import { SValues } from "./SValues/AllSValues";
// import type { SMergedObjects } from "./SValues/SObjects/SMergedObjects";
import type { SNormalObject } from "./SValues/SObjects/SNormalObject";
import type { SObjectValue } from "./SValues/SObjects/SObjectValue";
import { convertAllPropertiesToSValues } from "./SValues/SObjects/SObjectValueImpl";
import type { SUndefinedValue } from "./SValues/SPrimitiveValues/SUndefinedValue";
import type { SValue } from "./SValues/SValue";
import type { TranspileContext, ValueMetadataSystem } from "./TranspileContext";

type SymbolsRecord<M extends MaybeSValueMetadata> = Record<string, SymbolsRecordEntry<M> | undefined>;
type SymbolsRecordEntry<M extends MaybeSValueMetadata> = {
  kind: 'exposed' | 'const' | 'let' | "var"
} & (
  {
    kind: 'exposed'
    exposedGetterSetter: ExposedGlobal
  } | {
    kind: 'const' | 'let' | "var",
    value: SValue<M>
  }
)

interface SGlobalProtocols<M extends MaybeSValueMetadata> {
  // ObjectProtocol: SMergedObjects<M>;
  ObjectProtocol: SObjectValue<M, any, any>;
  FunctionProtocol: SNormalObject<M>;
  NumberProtocol: SNormalObject<M>;
  BooleanProtocol: SNormalObject<M>;
  BigIntProtocol: SNormalObject<M>;
  StringProtocol: SNormalObject<M>;
  SymbolProtocol: SNormalObject<M>;
  ArrayProtocol: SNormalObject<M>;
  // BoxNumber: (number: number, metadata: M) => SNormalObject<M>;
}

export type SRootSymbolTable<M extends MaybeSValueMetadata> = SLocalSymbolTable<M> & {readonly parent: null}

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

  assignGlobalExposed(key: string, exposedGetterSetter: ExposedGlobal) {
    this.symbols[key] = {
      kind: "exposed",
      exposedGetterSetter: exposedGetterSetter
    };
  }

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
        return new SValues.SUndefinedValue(this.transpileContext.valueMetadataSystem?.newMetadataForRuntimeTimeEmergingValue());
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
        return new SValues.SUndefinedValue(this.transpileContext.valueMetadataSystem?.newMetadataForRuntimeTimeEmergingValue());
      case "update":
        this.symbols[key] = {
          kind: "var",
          value: newValue
        };
        return newValue;
      }
    case "exposed":
      switch (kind) {
      case "const":
      case "let":
      case "var":
        throw SUserError.symbolConflictsWithGloballyExposedSymbol(key);
      case "update":
        if (newValue instanceof SValues.SPrimitiveValue) {
          if ("setter" in entry.exposedGetterSetter) {
            entry.exposedGetterSetter.setter(newValue.nativeJsValue);
          }
        }
        return newValue;
      }
    }
  }
  sSet<T extends SValue<M>>(p: string, newValue: T, receiver: undefined): T {
    let tbl: SLocalSymbolTable<M> = this;
    while (true) {
      const entry = tbl.symbols[p];
      if (entry !== undefined) {
        tbl.assign(p, newValue, "update");
        return newValue;
      }
      if (tbl.parent === null) {
        tbl.assign(p, newValue, "update");
        return newValue;
      } else {
        tbl = tbl.parent;
      }
    }
  }
  sGet(p: string, receiver: undefined, sTable: SLocalSymbolTable<M>): SValue<M> {
    const entry = this.symbols[p];
    if (entry !== undefined) {
      if ("value" in entry) {
        return entry.value;
      } else {
        const nativeJsValue = entry.exposedGetterSetter.getter();
        const sValue = SValues.SPrimitiveValue.newPrimitiveFromJSValue(nativeJsValue, sTable.newMetadataForRuntimeTimeEmergingValue());
        if (sValue === null) {
          throw SUserError.globallyExposedSymbolNotAPrimitive(p);
        } else {
          return sValue;
        }
      }
    } else if (this.parent !== null) {
      return this.parent.sGet(p, undefined, sTable);
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
    sArguments: SValue<M>[] | undefined,
    argNames: string[] | undefined,
    restArgName: string | undefined,
  ): SLocalSymbolTable<M> {
    const symbolsInChild: SymbolsRecord<M> = {};
    if (sArguments !== undefined) {
      const arrayOfSValues = convertAllPropertiesToSValues({}, sArguments, this);
      const sPrototype = new SValues.SNullValue(this.newMetadataForRuntimeTimeEmergingValue()); // todo! should be object prototype?
      const args: SNormalObject<M> = SValues.SNormalObject.create(arrayOfSValues, sPrototype, this);
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
        if (restArgName !== undefined) {
          sArguments.splice(0, argNames.length);
          const sRestArrayValue = SValues.SArrayObject.create(sArguments, this);
          symbolsInChild[restArgName] = {
            kind: "const",
            value: sRestArrayValue
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
  static createGlobal<M extends MaybeSValueMetadata>(transpileContext: TranspileContext<M>): SRootSymbolTable<M> {
    return new SLocalSymbolTable<M>(new SValues.SUndefinedValue(transpileContext.valueMetadataSystem?.newMetadataForRuntimeTimeEmergingValue()), {}, null, transpileContext) as SRootSymbolTable<M>;
  }
}