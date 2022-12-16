import { parse } from "acorn";
import { encodeUnsafeStringAsJSLiteralString } from "./EncodeString";
import { ArrayExpressionNode, AssignmentExpressionNode, BinaryExpressionNode, CallExpressionNode, ExpressionStatementNode, FunctionExpressionNode, IdentifierNode, LiteralNode, LogicalExpressionNode, MemberExpressionNode, ObjectExpressionNode, ProgramNode, PropertyNode, ReturnStatementNode, TemplateLiteralNode, UnaryExpressionNode, VariableDeclarationNode, VariableDeclaratorNode } from "./Models/ASTNodes";
import { TranspileContext } from "./TranspileContext";


export function transpile(
  unsafeJs: string,
  transpileContext: TranspileContext<any>
): string {
  const ast = parse(unsafeJs, {
    ecmaVersion: "latest",
    sourceType: "module"
  });
  transpileContext.lastParsedJs = unsafeJs;
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
function resolveLookup(lookupCode: string): string {
  return "sContext.sGet(" + lookupCode + ",'todo-receiver',sContext)";
};
function resolveLookupIdentifierByName(identifierName: string, transpileContext: TranspileContext<any>): string {
  var regEx = /^[0-9a-zA-Z_]+$/;
  if(identifierName.match(regEx) === null) {
    throw Error("Identifier names must be only alphanumeric characters or underscores.")
  }
  return resolveLookup("'" + identifierName + "'");
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
  return `${leftCode}.${operatorCode}(${rightCode},sContext)`;
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
          propertiesCodes.push(keyCode + ":" + valueCode);
        }
      } else {
        throw new Error(`Unsupported property kind in ObjectExpression ${propertyNode.kind}`);
      }
    } else {
      throw new Error(`Unsupported property AST node type in ObjectExpression ${property.type}`);
    }
  }
  let sObjectValueInitArgsCode = "{" + propertiesCodes.join(",") + "}";
  return `new SValues.SNormalObject(${sObjectValueInitArgsCode},sContext)`;
};
function resolveMemberExpressionReturningPieces(node: MemberExpressionNode, transpileContext: TranspileContext<any>): {objectCode: string, propertyCode: string} {
  let propertyCode: string;
  if (node.property.type === "Identifier") {
    propertyCode = resolveLookupIdentifierByName((node.property as IdentifierNode).name, transpileContext);
  } else {
    propertyCode = resolveLookup(`${resolveAnyNode(node.property, transpileContext)}.sToPropertyKey()`)
  }
  const objectCode: string = resolveAnyNode(node.object, transpileContext);
  return {objectCode, propertyCode};
};
function resolveMemberExpression(node: MemberExpressionNode, transpileContext: TranspileContext<any>): string {
  const res = resolveMemberExpressionReturningPieces(node, transpileContext);
  return res.objectCode + "." + res.propertyCode;
};
function resolveArrayExpression(node: ArrayExpressionNode, transpileContext: TranspileContext<any>): string {
  let allElementsCode = "";
  for (const el of node.elements) {
    if (el === null) {
      allElementsCode += ",";
    } else {
      allElementsCode += resolveAnyNode(el, transpileContext) + ",";
    }
  }
  let sArrayValueInitArgsCode = "[" + allElementsCode + "]";
  return `new SValues.SArrayObject(${sArrayValueInitArgsCode},sContext)`
};
function resolveVariableDeclarator(node: VariableDeclaratorNode, kind: 'const' | 'let' | "var", transpileContext: TranspileContext<any>): string {
  const initCode = resolveAnyNode(node.init, transpileContext);
  const idType = node.id.type;
  if (idType === "Identifier") {
    const idNode = node.id as IdentifierNode;
    return `sContext.assign("${idNode.name}",${initCode},"${kind}")`;
  } else {
    throw new Error(`Unsupported id AST node type in VariableDeclarator ${idType}`);
  }
}
function resolveVariableDeclaration(node: VariableDeclarationNode, transpileContext: TranspileContext<any>): string {
  let varKind: 'const' | 'let' | "var";
  switch (node.kind) {
  case "const":
    varKind = "const";
    break
  case "let":
    varKind = "let";
    break
  case "var":
    varKind = "var";
    break
  default:
    throw new Error(`Unsupported variable declaration kind in VariableDeclaration "${node.kind}"`);
  }
  let declCode = "";
  for (const decl of node.declarations) {
    if (decl.type === "VariableDeclarator") {
      declCode += resolveVariableDeclarator(decl as VariableDeclaratorNode, varKind, transpileContext);
    } else {
      throw new Error(`Unsupported AST decl node type in VariableDeclaration ${decl.type}`);
    }
  }
  return declCode;
};
function resolveExpressionStatement(node: ExpressionStatementNode, transpileContext: TranspileContext<any>): string {
  return resolveAnyNode(node.expression, transpileContext);
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
  return `${leftCode}.${operatorCode}(()=>${rightCode},sContext)`;
};
function resolveCallExpression(node: CallExpressionNode, transpileContext: TranspileContext<any>): string {
  const lookupCode: string = resolveAnyNode(node.callee, transpileContext);
  const argumentsCode: string[] = node.arguments.map((arg: acorn.Node) => {
    return resolveAnyNode(arg, transpileContext);
  });
  return `${lookupCode}.sApply("thisArg-todo",[${argumentsCode.join(",")}],sContext)`
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
function resolveAssignmentExpression(node: AssignmentExpressionNode, transpileContext: TranspileContext<any>): string {
  let baseRightCode = resolveAnyNode(node.right, transpileContext);
  let isLogicalOp = false;
  const operator = node.operator;
  let compoundAssignmentOperatorsWork: string | null;
  switch (operator) {
  case "=":
    compoundAssignmentOperatorsWork = null;
    break
  case "+=":
    compoundAssignmentOperatorsWork = "sBinaryAdd";
    break
  case "-=":
    compoundAssignmentOperatorsWork = "sBinarySubtract";
    break
  case "*=":
    compoundAssignmentOperatorsWork = "sBinaryMult";
    break
  case "/=":
    compoundAssignmentOperatorsWork = "sBinaryDiv";
    break
  case "%=":
    compoundAssignmentOperatorsWork = "sBinaryMod";
    break
  case "**=":
    compoundAssignmentOperatorsWork = "sBinaryExpo";
    break
  case "<<=":
    compoundAssignmentOperatorsWork = "sBitwiseLeftShift";
    break
  case ">>=":
    compoundAssignmentOperatorsWork = "sBitwiseRightShift";
    break
  case ">>>=":
    compoundAssignmentOperatorsWork = "sBitwiseUnsignedRight";
    break
  case "&=":
    compoundAssignmentOperatorsWork = "sBitwiseAND";
    break
  case "^=":
    compoundAssignmentOperatorsWork = "sBitwiseXOR";
    break
  case "|=":
    compoundAssignmentOperatorsWork = "sBitwiseOR";
    break
  case "&&":
    isLogicalOp = true;
    compoundAssignmentOperatorsWork = "sLogicalAnd";
    break
  case "||":
    isLogicalOp = true;
    compoundAssignmentOperatorsWork = "sLogicalOr";
    break
  case "??=":
    isLogicalOp = true;
    compoundAssignmentOperatorsWork = "sLogicalNullish";
    break
  default:
    throw new Error(`Unsupported operator in AssignmentExpression ${operator}`);
  }
  if (isLogicalOp) {
    baseRightCode = `()=>${baseRightCode}`;
  }
  let contextLookup: string;
  let keyToLookup: string;
  const leftType = node.left.type;
  if (leftType === "Identifier") {
    contextLookup = "sContext";
    const leftIdentifier = node.left as IdentifierNode;
    keyToLookup = leftIdentifier.name;
  // } else if (leftType === "MemberExpression") {
  //   const leftMemberExpression = node.left as MemberExpressionNode;
  //   const objectCode: string = resolveMemberExpressionObject(leftMemberExpression.object);
  //   if (leftMemberExpression.property.type === "Identifier") {
  //     const propertyNode = leftMemberExpression.property as IdentifierNode;
  //     return `${objectCode}.nsContext.setNSVar("${propertyNode.name}", ${rightCode}, "set", nsStackFrameInfo)`;
  //   } else {
  //     throw new NSError(`Unsupported property AST node type in AssignmentExpression left MemberExpression ${leftMemberExpression.property.type}`);
  //   }
  } else {
    throw new Error(`Unsupported AST node on left of AssignmentExpression ${leftType}`);  
  }
  let rightCode: string;
  if (compoundAssignmentOperatorsWork === null) {
    rightCode = baseRightCode;
  } else {
    let getterCode = `${contextLookup}.sGet("${keyToLookup}",'todo-receiver',sContext)`
    rightCode = `${getterCode}.${compoundAssignmentOperatorsWork}(${baseRightCode},sContext)`
  }
  return `${contextLookup}.assign("${keyToLookup}",${rightCode},"update")`;
}
function resolveFunctionExpression(node: FunctionExpressionNode, transpileContext: TranspileContext<any>): string {
  const functionAsString = encodeUnsafeStringAsJSLiteralString(transpileContext.lastParsedJs.slice(node.start, node.end));
  const functionBody = resolveCodeBody(node.body.body, false, transpileContext);
  const actualFunction = `function(sThisArg, sArgArray){${functionBody}}`
  return `new SValues.SFunction(${actualFunction},${functionAsString},sContext)`;
}
function resolveReturnStatement(node: ReturnStatementNode, transpileContext: TranspileContext<any>): string {
  const returnValue = resolveAnyNode(node.argument, transpileContext);
  return `return ${returnValue};`;
}
function resolveAnyNode(node: acorn.Node, transpileContext: TranspileContext<any>): string {
  if (node.type === "Literal") {
    return resolveLiteral(node as LiteralNode, transpileContext);
  } else if (node.type === "BinaryExpression") {
    return resolveBinaryExpression(node as BinaryExpressionNode, transpileContext);
  } else if (node.type === "UnaryExpression") {
    return resolveUnaryExpression(node as UnaryExpressionNode, transpileContext);
  } else if (node.type === "LogicalExpression") {
    return resolveLogicalExpression(node as LogicalExpressionNode, transpileContext);
  } else if (node.type === "MemberExpression") {
    return resolveMemberExpression(node as MemberExpressionNode, transpileContext);
  } else if (node.type === "ObjectExpression") {
    return resolveObjectExpression(node as ObjectExpressionNode, transpileContext);
  } else if (node.type === "Identifier") {
    return resolveIdentifier(node as IdentifierNode, transpileContext);
  } else if (node.type === "ExpressionStatement") {
    return resolveExpressionStatement(node as ExpressionStatementNode, transpileContext);
  // } else if (node.type === "ArrowFunctionExpression") {
  //   return resolveArrowFunctionExpression(node as ArrowFunctionExpressionNode);
  } else if (node.type === "VariableDeclaration") {
    return resolveVariableDeclaration(node as VariableDeclarationNode, transpileContext);
  // } else if (node.expression === "VariableDeclarator") {
  //   return resolveVariableDeclarator(node as VariableDeclaratorNode, "set");
  // } else if (node.expression === "IfStatement") {
  //   return resolveIfStatement(node as IfStatementNode);
  } else if (node.type === "FunctionExpression") {
    return resolveFunctionExpression(node as FunctionExpressionNode, transpileContext);
  } else if (node.type === "CallExpression") {
    return resolveCallExpression(node as CallExpressionNode, transpileContext);
  } else if (node.type === "TemplateLiteral") {
    return resolveTemplateLiteral(node as TemplateLiteralNode, transpileContext);
  } else if (node.type === "ArrayExpression") {
    return resolveArrayExpression(node as ArrayExpressionNode, transpileContext);
  } else if (node.type === "AssignmentExpression") {
    return resolveAssignmentExpression(node as AssignmentExpressionNode, transpileContext);
  } else if (node.type === "ReturnStatement") {
    return resolveReturnStatement(node as ReturnStatementNode, transpileContext);
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