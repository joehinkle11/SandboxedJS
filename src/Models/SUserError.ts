import { SValue } from "../SValues";

// An error in user-space (i.e., not an issue with the transpiler, but user code).
export class SUserError extends Error {
  userError: Error;
  constructor(userError: Error) {
    super();
    this.userError = userError;
  }

  static get invalidMixBigInt(): SUserError {
    return new SUserError(new Error("TypeError: Invalid mix of BigInt and other type in addition."));
  }
  static cannotPerformBinaryOp(op: string, left: SValue<any>, right: SValue<any>): SUserError {
    return new SUserError(new Error(
      `Cannot perform binary operator "${op}" on ${left.constructor.name} and ${right.constructor.name}`
    ));
  }
}