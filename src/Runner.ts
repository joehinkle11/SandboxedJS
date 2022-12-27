import { transpile } from "./Transpile";
import { SValues as SValuesImported } from "./SValues/AllSValues";const SValues = SValuesImported;
import { RunnerBuiltIns, TranspileContext, TranspileContextSetup, ValueMetadataSystem } from "./TranspileContext";
import { MaybeSValueMetadata, SValueMetadata } from "./SValueMetadata";
import { SLocalSymbolTable, SRootSymbolTable } from "./SLocalSymbolTable";
import { SValue } from "./SValues/SValue";
import { installGeneratedBindings } from "./gen/Bindings_Generated";
import { installHardcodedEcmaScriptBindings } from "./BuiltIns/BuiltInECMAScript";

export class SandboxedJSRunner<M extends MaybeSValueMetadata> {
  readonly sTable: SRootSymbolTable<M>;
  private readonly transpileContext: TranspileContext<M>;

  private constructor(transpileContextSetup: TranspileContextSetup<M>) {
    this.transpileContext = new TranspileContext(transpileContextSetup);
    this.sTable = SLocalSymbolTable.createGlobal<M>(this.transpileContext);
    if (transpileContextSetup.builtIns.ecmaScript !== false) {
      installGeneratedBindings(this.sTable);
      installHardcodedEcmaScriptBindings(this.sTable);
    }
  }
  static newRunnerWithMetadata<M extends SValueMetadata>(
    valueMetadataSystem: ValueMetadataSystem<M>,
    builtIns: RunnerBuiltIns = {},
  ): SandboxedJSRunner<M> {
    return new SandboxedJSRunner<M>(
      {
        builtIns: builtIns,
        valueMetadataSystem: valueMetadataSystem as any
      }
    );
  }
  static newRunnerWithoutMetadata(builtIns: RunnerBuiltIns = {}): SandboxedJSRunner<undefined> {
    return new SandboxedJSRunner<undefined>(
      {
        builtIns: builtIns,
        valueMetadataSystem: null
      }
    );
  }
  
  evalJs<AsNativeJs extends boolean>(jsCode: string, options: {returnNativeJSValue: AsNativeJs}): AsNativeJs extends true ? any : SValue<M> {
    const transpiledJsCode: string = this.transpile(jsCode);
    return this.evalTranspiledCode(transpiledJsCode, options.returnNativeJSValue);
  }
  transpile(jsCode: string): string {
    return transpile(jsCode, this.transpileContext);
  }
  evalTranspiledCode<AsNativeJs extends boolean>(transpiledJsCode: string, asNativeJs: AsNativeJs): AsNativeJs extends true ? any : SValue<M> {
    let sResult: SValue<M>;
    const sContext = this.sTable.duplicateAndEraseMetadata();
    try {
      const result = eval(transpiledJsCode);
      if (result instanceof SValue) {
        sResult = result;
      } else {
        sResult = new SValues.SUndefinedValue(sContext.newMetadataForRuntimeTimeEmergingValue());
      }
    } catch (e) {
      throw [e, new Error("Transpiled code:\n\n" + transpiledJsCode)];
    }
    if (asNativeJs) {
      try {
        return sResult.getNativeJsValue(this.sTable);
      } catch (e) {
        throw [e, new Error("Failed to convert s-value to native js value.")];
      }
    } else {
      return sResult;
    }
  }
}