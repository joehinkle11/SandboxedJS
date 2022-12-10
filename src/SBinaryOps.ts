import { MaybeSValueMetadata } from "./SValueMetadata";
import { SBooleanValue, SNumberValue, SValue } from "./SValues";
import { TranspileContext } from "./TranspileContext";

// +
export function sBinaryAdd<M extends MaybeSValueMetadata>(
  left: SValue<M>,
  right: SValue<M>,
  transpileContext: TranspileContext<M>
): SValue<M> {
  const valueMetadataSystem = transpileContext.valueMetadataSystem;
  const resultingMetadata: M = valueMetadataSystem === null ? undefined : valueMetadataSystem.newMetadataForBinaryOperation(left, right);
  if (left instanceof SNumberValue) {
    if (right instanceof SNumberValue) {
      return new SNumberValue(left.value + right.value, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(left.value + Number(right.value), resultingMetadata);
    }
  } else if (left instanceof SBooleanValue) {
    if (right instanceof SNumberValue) {
      return new SNumberValue(Number(left.value) + right.value, resultingMetadata);
    }
  }
  throw new Error(`Cannot perform binary operator "+" on ${left.constructor.name} and ${right.constructor.name}`);
}