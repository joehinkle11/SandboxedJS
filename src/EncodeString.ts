

// The basic idea is to do "hello "world" and convert it to "hello \"world".
// The end result MUST be safe to drop straight a js eval func where it MUST
// be evaluated as a string. If this function fails, it is a major security issue.
export function encodeUnsafeStringAsJSLiteralString(unsafeString: string): `'${string}'` {
  const safeString = unsafeString.replaceAll("'","\\'").replaceAll("\n","\\n");
  return `'${safeString}'`;
}
