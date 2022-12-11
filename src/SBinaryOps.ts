import { MaybeSValueMetadata } from "./SValueMetadata";
import { SBigIntValue, SBooleanValue, SNullValue, SNumberValue, SStringValue, SUndefinedValue, SValue } from "./SValues";
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
    } else if (right instanceof SStringValue) {
      return new SStringValue(left.value + right.value, resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SNumberValue(left.value, resultingMetadata);
    }
  } else if (left instanceof SBooleanValue) {
    if (right instanceof SNumberValue) {
      return new SNumberValue(Number(left.value) + right.value, resultingMetadata);
    } else if (right instanceof SStringValue) {
      return new SStringValue(left.value + right.value, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(Number(left.value) + Number(right.value), resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SNumberValue(Number(left.value), resultingMetadata);
    }
  } else if (left instanceof SStringValue) {
    if (right instanceof SStringValue) {
      return new SStringValue(left.value + right.value, resultingMetadata);
    } else if (right instanceof SNumberValue) {
      return new SStringValue(left.value + right.value, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SStringValue(left.value + right.value, resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SStringValue(left.value + right.value, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SStringValue(left.value + right.value, resultingMetadata);
    }
  } else if (left instanceof SUndefinedValue) {
    if (right instanceof SStringValue) {
      return new SStringValue(left.value + right.value, resultingMetadata);
    } else if (right instanceof SNumberValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SNumberValue(NaN, resultingMetadata);
    }
  } else if (left instanceof SBigIntValue) {
    if (right instanceof SBigIntValue) {
      return new SBigIntValue(left.value + right.value, resultingMetadata);
    } else {
      throw new Error("Todo: user error (not transpiler)")
    }
  } else if (left instanceof SNullValue) {
    if (right instanceof SStringValue) {
      return new SStringValue(left.value + right.value, resultingMetadata);
    } else if (right instanceof SNumberValue) {
      return new SNumberValue(right.value, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(Number(right.value), resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SNumberValue(0, resultingMetadata);
    }
  }
  throw new Error(`Cannot perform binary operator "+" on ${left.constructor.name} and ${right.constructor.name}`);
}
// -
export function sBinarySubtract<M extends MaybeSValueMetadata>(
  left: SValue<M>,
  right: SValue<M>,
  transpileContext: TranspileContext<M>
): SValue<M> {
  const valueMetadataSystem = transpileContext.valueMetadataSystem;
  const resultingMetadata: M = valueMetadataSystem === null ? undefined : valueMetadataSystem.newMetadataForBinaryOperation(left, right);
  if (left instanceof SNumberValue) {
    if (right instanceof SNumberValue) {
      return new SNumberValue(left.value - right.value, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(left.value - Number(right.value), resultingMetadata);
    } else if (right instanceof SStringValue) {
      return new SNumberValue(left.value - Number(right.value), resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SNumberValue(left.value, resultingMetadata);
    }
  } else if (left instanceof SBooleanValue) {
    if (right instanceof SNumberValue) {
      return new SNumberValue(Number(left.value) - right.value, resultingMetadata);
    } else if (right instanceof SStringValue) {
      return new SNumberValue(Number(left.value) - Number(right.value), resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(Number(left.value) - Number(right.value), resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SNumberValue(Number(left.value), resultingMetadata);
    }
  } else if (left instanceof SStringValue) {
    if (right instanceof SStringValue) {
      return new SNumberValue(Number(left.value) - Number(right.value), resultingMetadata);
    } else if (right instanceof SNumberValue) {
      return new SNumberValue(Number(left.value) - right.value, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(Number(left.value) - Number(right.value), resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SNumberValue(NaN, resultingMetadata);
    }
  } else if (left instanceof SUndefinedValue) {
    if (right instanceof SBigIntValue) {
      throw new Error("Todo: user error (not transpiler)")
    } else {
      return new SNumberValue(NaN, resultingMetadata);
    }
  } else if (left instanceof SBigIntValue) {
    if (right instanceof SBigIntValue) {
      return new SBigIntValue(left.value - right.value, resultingMetadata);
    } else {
      throw new Error("Todo: user error (not transpiler)")
    }
  } else if (left instanceof SNullValue) {
    if (right instanceof SStringValue) {
      return new SNumberValue(-Number(right.value), resultingMetadata);
    } else if (right instanceof SNumberValue) {
      return new SNumberValue(-right.value, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(-Number(right.value), resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SBigIntValue) {
      throw new Error("Todo: user error (not transpiler)")
    } else if (right instanceof SNullValue) {
      return new SNumberValue(0, resultingMetadata);
    }
  }
  throw new Error(`Cannot perform binary operator "-" on ${left.constructor.name} and ${right.constructor.name}`);
}