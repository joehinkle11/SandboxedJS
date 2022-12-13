import { parse } from "acorn";
import { encodeUnsafeStringAsJSLiteralString } from "./EncodeString";
import { BinaryExpressionNode, ExpressionStatementNode, IdentifierNode, LiteralNode, LogicalExpressionNode, MemberExpressionNode, ObjectExpressionNode, ProgramNode, PropertyNode, TemplateLiteralNode, UnaryExpressionNode } from "./Models/ASTNodes";
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
    return `new SValues.SBigIntValue(${value}n${transpileContext.newMetadataJsCodeForCompileTimeLiteral()})`;
  case "number":
    return `new SValues.SNumberValue(${value}${transpileContext.newMetadataJsCodeForCompileTimeLiteral()})`;
  case "string":
    return resolveStringLiteral(value, transpileContext)
  case "boolean":
    return `new SValues.SBooleanValue(${value}${transpileContext.newMetadataJsCodeForCompileTimeLiteral()})`;
  case "object":
    if (value === null) {
      return `new SValues.SNullValue(${transpileContext.newMetadataJsCodeForCompileTimeLiteral()})`;
    }
  default:
    break
  }
  throw new Error(`Unsupported literal "${typeof value}"`);
};
function resolveLookupIdentifierByName(identifierName: string, transpileContext: TranspileContext<any>): string {
  var regEx = /^[0-9a-zA-Z_]+$/;
  if(identifierName.match(regEx) === null) {
    throw Error("Identifier names must be only alphanumeric characters or underscores.")
  }
  return "sGet('" + identifierName + "','todo-receiver',transpileContext)";
};
function resolveIdentifier(node: IdentifierNode, transpileContext: TranspileContext<any>): string {
  // Check if it is a restricted identifier first
  const name = node.name;
  switch (name) {
  case "undefined":
    return `new SValues.SUndefinedValue(${transpileContext.newMetadataJsCodeForCompileTimeLiteral()})`;
  case "NaN":
    return `new SValues.SNumberValue(NaN${transpileContext.newMetadataJsCodeForCompileTimeLiteral()})`;
  case "Infinity":
    return `new SValues.SNumberValue(Infinity${transpileContext.newMetadataJsCodeForCompileTimeLiteral()})`;
  default:
    return resolveLookupIdentifierByName(name, transpileContext);
  }
};
function resolveStringLiteral(unsafeString: string, transpileContext: TranspileContext<any>): string {
  const safeJSStringLiteral = encodeUnsafeStringAsJSLiteralString(unsafeString);
  return `new SValues.SStringValue(${safeJSStringLiteral}${transpileContext.newMetadataJsCodeForCompileTimeLiteral()})`;
}
function resolveTemplateLiteral(node: TemplateLiteralNode, transpileContext: TranspileContext<any>): string {
  if (node.expressions.length === 0) {
    let unsafeString = "";
    for (const quasi of node.quasis) {
      unsafeString += quasi.value.raw;
    }
    return resolveStringLiteral(unsafeString, transpileContext);
  }
  throw Error("Template strings are not yet supported.")
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
  } else if (operator === "**") {
    operatorCode = "sBinaryExpo";
  } else if (operator === "%") {
    operatorCode = "sBinaryMod";
  } else if (operator === "&") {
    operatorCode = "sBitwiseAND"
  } else if (operator === "|") {
    operatorCode = "sBitwiseOR"
  } else if (operator === "~") {
    operatorCode = "sBitwiseNOT"
  } else if (operator === "^") {
    operatorCode = "sBitwiseXOR"
  } else if (operator === "<<") {
    operatorCode = "sBitwiseLeftShift"
  } else if (operator === ">>") {
    operatorCode = "sBitwiseRightShift"
  } else if (operator === ">>>") {
    operatorCode = "sBitwiseUnsignedRight"
  } else if (operator === "==") {
    operatorCode = "sCompEqualValue";
  } else if (operator === "===") {
    operatorCode = "sCompEqualValueAndEqualType";
  } else if (operator === "!=") {
    operatorCode = "sCompNotEqualValue";
  } else if (operator === "!==") {
    operatorCode = "sCompNotEqualValueAndEqualType";
  } else if (operator === ">") {
    operatorCode = "sCompGreaterThan";
  } else if (operator === "<") {
    operatorCode = "sCompLessThan";
  } else if (operator === ">=") {
    operatorCode = "sCompGreaterThanOrEqualTo";
  } else if (operator === "<=") {
    operatorCode = "sCompLessThanOrEqualTo";
  } else {
    throw new Error(`Unsupported operator in BinaryExpression "${operator}"`);
  }
  const leftCode = resolveAnyNode(node.left, transpileContext);
  const rightCode = resolveAnyNode(node.right, transpileContext);
  return `${leftCode}.${operatorCode}(${rightCode},transpileContext)`;
};
function resolveObjectExpression(node: ObjectExpressionNode, transpileContext: TranspileContext<any>): string {
  let propertiesCodes: string[] = [];
  for (const property of node.properties) {
    if (property.type === "Property") {
      const propertyNode = property as PropertyNode;
      if (propertyNode.kind === "init") {
        if (propertyNode.method) {
          throw new Error(`Method properties in ObjectExpression are not supported.`);
        } else {
          const keyType = propertyNode.key.type;
          let keyCode: string;
          if (keyType === "Identifier") {
            const keyNode = propertyNode.key as IdentifierNode;
            keyCode = keyNode.name;
          } else {
            keyCode = `[${resolveAnyNode(propertyNode.key, transpileContext)}.sToPropertyKey()]`;
          }
          let valueCode = resolveAnyNode(propertyNode.value, transpileContext);
          propertiesCodes.push(keyCode + ":{value:" + valueCode + "}");
        }
      } else {
        throw new Error(`Unsupported property kind in ObjectExpression ${propertyNode.kind}`);
      }
    } else {
      throw new Error(`Unsupported property AST node type in ObjectExpression ${property.type}`);
    }
  }
  let sObjectValueInitArgsCode = "{kind:'normal',props:{" + propertiesCodes.join(",") + "}}";
  return `new SValues.SObjectValue(${sObjectValueInitArgsCode},transpileContext)`;
};
function resolveMemberExpressionObject(node: acorn.Node, transpileContext: TranspileContext<any>): string {
  if (node.type === "Identifier") {
    return resolveIdentifier(node as IdentifierNode, transpileContext);
  } else if (node.type === "MemberExpression") {
    return resolveMemberExpression(node as MemberExpressionNode, transpileContext);
  } else if (node.type === "ObjectExpression") {
    return resolveObjectExpression(node as ObjectExpressionNode, transpileContext);
  } else {
    throw new Error(`Unsupported object AST node type in MemberExpressionObject object ${node.type}`);
  }
}
function resolveMemberExpressionReturningPieces(node: MemberExpressionNode, transpileContext: TranspileContext<any>): {objectCode: string, propertyCode: string} {
  let propertyCode: string;
  if (node.property.type === "Identifier") {
    propertyCode = resolveLookupIdentifierByName((node.property as IdentifierNode).name, transpileContext);
  } else {
    throw new Error(`Unsupported property AST node type in MemberExpressionReturningPieces property ${node.property.type}`);
  }
  const objectCode: string = resolveMemberExpressionObject(node.object, transpileContext);
  return {objectCode, propertyCode};
};
function resolveMemberExpression(node: MemberExpressionNode, transpileContext: TranspileContext<any>): string {
  const res = resolveMemberExpressionReturningPieces(node, transpileContext);
  return res.objectCode + "." + res.propertyCode;
};
function resolveExpressionStatement(node: ExpressionStatementNode, transpileContext: TranspileContext<any>): string {
  if (node.expression.type === "Literal") {
    return resolveLiteral(node.expression as LiteralNode, transpileContext);
  } else if (node.expression.type === "BinaryExpression") {
    return resolveBinaryExpression(node.expression as BinaryExpressionNode, transpileContext);
  } else if (node.expression.type === "UnaryExpression") {
    return resolveUnaryExpression(node.expression as UnaryExpressionNode, transpileContext);
  } else if (node.expression.type === "LogicalExpression") {
    return resolveLogicalExpression(node.expression as LogicalExpressionNode, transpileContext);
  } else if (node.expression.type === "MemberExpression") {
    return resolveMemberExpression(node.expression as MemberExpressionNode, transpileContext);
  } else if (node.expression.type === "ObjectExpression") {
    return resolveObjectExpression(node.expression as ObjectExpressionNode, transpileContext);
  } else if (node.expression.type === "Identifier") {
    return resolveIdentifier(node.expression as IdentifierNode, transpileContext);
  } else if (node.expression.type === "TemplateLiteral") {
    return resolveTemplateLiteral(node.expression as TemplateLiteralNode, transpileContext);
  } else {
    throw new Error(`Unsupported expression AST node type in ExpressionStatement ${node.expression.type}`);
  }
};
function resolveLogicalExpression(node: LogicalExpressionNode, transpileContext: TranspileContext<any>): string {
  const operator = node.operator;
  let operatorCode: string;
  if (operator === "&&") {
    operatorCode = "sLogicalAnd";
  } else if (operator === "||") {
    operatorCode = "sLogicalOr";
  } else if (operator === "??") {
    operatorCode = "sLogicalNullish";
  } else {
    throw new Error(`Unsupported operator in LogicalExpression "${operator}"`);
  }
  const leftCode = resolveAnyNode(node.left, transpileContext);
  const rightCode = resolveAnyNode(node.right, transpileContext);
  return `${leftCode}.${operatorCode}(()=>${rightCode},transpileContext)`;
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
  case "!":
    return argumentCode + ".sUnaryLogicalNot()"
  case "typeof":
    return argumentCode + ".sUnaryTypeOf()"
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
  } else if (node.type === "ObjectExpression") {
    return resolveObjectExpression(node as ObjectExpressionNode, transpileContext);
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