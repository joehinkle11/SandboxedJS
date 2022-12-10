import { parse } from "acorn";
import { BinaryExpressionNode, ExpressionStatementNode, IdentifierNode, LiteralNode, ProgramNode, UnaryExpressionNode } from "./Models/ASTNodes";
import { TranspileContext } from "./TranspileContext";


export function transpile(
  unsafeJs: string,
  transpileContext: TranspileContext<any>
): string {
  const ast = parse(unsafeJs, {
    ecmaVersion: "latest",
    sourceType: "module"
  });
  if (ast.type !== "Program") {
    throw new Error(`Unsupported root AST node type ${ast.type}`)
  }
  const programAST = ast as ProgramNode;
  if (programAST.sourceType !== "module") {
    throw new Error(`Unsupported root AST node sourceType ${programAST.sourceType}`)
  }
  // resolve program node
  return resolveCodeBody(programAST.body, true, transpileContext);
}

function resolveLiteral(node: LiteralNode, transpileContext: TranspileContext<any>): string {
  const value = node.value;
  switch (typeof value) {
  case "bigint":
    return `new SValues.SBigIntValue(${value}${transpileContext.newMetadataJsCodeForCompileTimeLiteral()})`;
  case "number":
    return `new SValues.SNumberValue(${value}${transpileContext.newMetadataJsCodeForCompileTimeLiteral()})`;
  case "string":
    return `new SValues.SStringValue(${value}${transpileContext.newMetadataJsCodeForCompileTimeLiteral()})`;
  case "boolean":
    return `new SValues.SBooleanValue(${value}${transpileContext.newMetadataJsCodeForCompileTimeLiteral()})`;
  default:
    break
  }
  throw new Error(`Unsupported literal "${typeof value}"`);
};
function resolveIdentifier(node: IdentifierNode, transpileContext: TranspileContext<any>): string {
  // Check if it is a restricted identifier first
  const name = node.name;
  switch (name) {
  case "NaN":
    return `new SValues.SNumberValue(NaN${transpileContext.newMetadataJsCodeForCompileTimeLiteral()})`;
  case "Infinity":
  return `new SValues.SNumberValue(Infinity${transpileContext.newMetadataJsCodeForCompileTimeLiteral()})`;
  default:
    throw new Error(`Identifier lookups not supported yet`);
  }
};
function resolveBinaryExpression(node: BinaryExpressionNode, transpileContext: TranspileContext<any>): string {
  const operator = node.operator;
  let operatorCode: string;
  if (operator === "+") {
    operatorCode = "sBinaryAdd";
  } else if (operator === "-") {
    operatorCode = "sBinarySubtract";
  } else if (operator === "*") {
    operatorCode = "sBinaryMult";
  } else if (operator === "/") {
    operatorCode = "sBinaryDiv";
  } else {
    throw new Error(`Unsupported operator in BinaryExpression "${operator}"`);
  }
  const leftCode = resolveAnyNode(node.left, transpileContext);
  const rightCode = resolveAnyNode(node.right, transpileContext);
  return `SBinaryOps.${operatorCode}(${leftCode},${rightCode},transpileContext)`;
};
function resolveExpressionStatement(node: ExpressionStatementNode, transpileContext: TranspileContext<any>): string {
  if (node.expression.type === "Literal") {
    return resolveLiteral(node.expression as LiteralNode, transpileContext);
  } else if (node.expression.type === "BinaryExpression") {
    return resolveBinaryExpression(node.expression as BinaryExpressionNode, transpileContext);
  } else if (node.expression.type === "UnaryExpression") {
    return resolveUnaryExpression(node.expression as UnaryExpressionNode, transpileContext);
  // if (node.expression.type === "CallExpression") {
  //   return resolveCallExpression(node.expression as CallExpressionNode);
  // } else if (node.expression.type === "AssignmentExpression") {
  //   return resolveAssignmentExpression(node.expression as AssignmentExpressionNode);
  } else if (node.expression.type === "Identifier") {
    return resolveIdentifier(node.expression as IdentifierNode, transpileContext);
  } else {
    throw new Error(`Unsupported expression AST node type in ExpressionStatement ${node.expression.type}`);
  }
};
function resolveUnaryExpression(node: UnaryExpressionNode, transpileContext: TranspileContext<any>): string {
  if (node.prefix !== true) {
    throw new Error(`Unsupported UnaryExpressionNode where prefix is false.`);
  }
  const argumentCode = resolveAnyNode(node.argument, transpileContext);
  const operator = node.operator;
  switch (operator) {
  case "-":
    return argumentCode + ".sUnaryNegate()"
  case "+":
    return argumentCode + ".sUnaryMakePositive()"
  default:
    throw new Error(`Unsupported UnaryExpressionNode operator '${operator}'.`);
  }
};
function resolveAnyNode(node: acorn.Node, transpileContext: TranspileContext<any>): string {
  if (node.type === "ExpressionStatement") {
    return resolveExpressionStatement(node as ExpressionStatementNode, transpileContext);
  } else if (node.type === "Literal") {
    return resolveLiteral(node as LiteralNode, transpileContext);
  // } else if (node.type === "LogicalExpression") {
  //   return resolveLogicalExpression(node as LogicalExpressionNode);
  } else if (node.type === "BinaryExpression") {
    return resolveBinaryExpression(node as BinaryExpressionNode, transpileContext);
  } else if (node.type === "Identifier") {
    return resolveIdentifier(node as IdentifierNode, transpileContext);
  // } else if (node.type === "ObjectExpression") {
  //   return resolveObjectExpression(node as ObjectExpressionNode);
  // } else if (node.type === "MemberExpression") {
  //   return resolveMemberExpression(node as MemberExpressionNode);
  // } else if (node.type === "ArrowFunctionExpression") {
  //   return resolveArrowFunctionExpression(node as ArrowFunctionExpressionNode);
  // } else if (node.type === "CallExpression") {
  //   return resolveCallExpression(node as CallExpressionNode);
  } else if (node.type === "UnaryExpression") {
    return resolveUnaryExpression(node as UnaryExpressionNode, transpileContext);
  } else {
    throw new Error(`Unsupported any AST node type ${node.type}`);
  }
};

// for BlockStatement and main program
function resolveCodeBody(body: acorn.Node[], isTopLevel: boolean, transpileContext: TranspileContext<any>): string {
  let jsCode = "";
  for (const elNode of body) {
    jsCode += resolveAnyNode(elNode, transpileContext);
    jsCode += ";\n"
  }
  return jsCode;
};