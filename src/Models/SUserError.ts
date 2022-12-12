import { SValue } from "../SValues";

// An error in user-space (i.e., not an issue with the transpiler, but user code).
export default class SUserError extends Error {
  userError: Error;

  get message(): string {
    return this.userError.message;
  }
  get name(): string {
    return this.userError.name;
  }
  get cause(): unknown | undefined {
    return this.userError.cause;
  }
  get stack(): string | undefined {
    return this.userError.stack;
  }

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