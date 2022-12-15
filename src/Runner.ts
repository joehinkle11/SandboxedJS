import { transpile } from "./Transpile";
import * as SValues from "./SValues";SValues;
import { TranspileContext, TranspileContextSetup, ValueMetadataSystem } from "./TranspileContext";
import { MaybeSValueMetadata, SValueMetadata } from "./SValueMetadata";
import { SLocalSymbolTable } from "./SLocalSymbolTable";

export class SandboxedJSRunner<M extends MaybeSValueMetadata> {
  transpileContext: TranspileContext<M>;

  private constructor(transpileContextSetup: TranspileContextSetup<M>) {
    this.transpileContext = new TranspileContext(transpileContextSetup);
  }
  static newRunnerWithMetadata<M extends SValueMetadata>(
    valueMetadataSystem: ValueMetadataSystem<M>
  ): SandboxedJSRunner<M> {
    return new SandboxedJSRunner<M>(
      {valueMetadataSystem: valueMetadataSystem} as TranspileContextSetup<M>
    );
  }
  static newRunnerWithoutMetadata(): SandboxedJSRunner<undefined> {
    return new SandboxedJSRunner<undefined>({valueMetadataSystem: null});
  }
  
  evalJs<AsNativeJs extends boolean>(jsCode: string, options: {returnNativeJSValue: AsNativeJs}): AsNativeJs extends true ? any : SValues.SValue<M> {
    const transpiledJsCode: string = this.transpile(jsCode);
    return this.evalTranspiledCode(transpiledJsCode, options.returnNativeJSValue);
  }
  transpile(jsCode: string): string {
    return transpile(jsCode, this.transpileContext);
  }
  evalTranspiledCode<AsNativeJs extends boolean>(transpiledJsCode: string, asNativeJs: AsNativeJs): AsNativeJs extends true ? any : SValues.SValue<M> {
    const sTable = SLocalSymbolTable.createGlobal<M>(this.transpileContext);
    let sResult: SValues.SValue<M>;
    try {
      const result = eval(transpiledJsCode);
      if (result instanceof SValues.SValue) {
        sResult = result;
      } else {
        sResult = new SValues.SUndefinedValue(sTable.newMetadataForRuntimeTimeEmergingValue());
      }
    } catch (e) {
      throw [e, new Error("Transpiled code:\n\n" + transpiledJsCode)];
    }
    if (asNativeJs) {
      return sResult.toNativeJS(sTable);
    } else {
      return sResult;
    }
  }
}