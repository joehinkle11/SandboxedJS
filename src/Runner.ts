import { transpile } from "./Transpile";
import * as SValues from "./SValues";SValues;
import { TranspileContext, TranspileContextSetup, ValueMetadataSystem } from "./TranspileContext";
import { MaybeSValueMetadata, SValueMetadata } from "./SValueMetadata";

export class SandboxedJSRunner<M extends MaybeSValueMetadata> {
  private transpileContext: TranspileContext<M>;

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
  
  evalJs(jsCode: string): SValues.SValue<M> {
    const transpiledJsCode: string = this.transpile(jsCode);
    return this.evalTranspiledCode(transpiledJsCode);
  }
  transpile(jsCode: string): string {
    return transpile(jsCode, this.transpileContext);
  }
  evalTranspiledCode(transpiledJsCode: string): SValues.SValue<M> {
    const sandboxedThis = this;
    const transpileContext = this.transpileContext;
    try {
      const result = eval(transpiledJsCode);
      if (result instanceof SValues.SValue) {
        return result;
      } else {
        return new SValues.SUndefinedValue(transpileContext.newMetadataForRuntimeTimeEmergingValue());
      }
    } catch (e) {
      throw [e, new Error("Transpiled code:\n\n" + transpiledJsCode)];
    }
  }
}