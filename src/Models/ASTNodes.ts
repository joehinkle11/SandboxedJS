import * as acorn from "acorn";

export interface ExpressionStatementNode extends acorn.Node {
  type: 'ExpressionStatement'
  expression: CallExpressionNode | acorn.Node
}
export interface CallExpressionNode extends acorn.Node {
  type: 'CallExpression'
  callee: acorn.Node
  arguments: acorn.Node[]
}
export interface UnaryExpressionNode extends acorn.Node {
  type: 'UnaryExpression'
  prefix: boolean
  operator: string
  argument: acorn.Node
}
export interface AssignmentExpressionNode extends acorn.Node {
  type: 'AssignmentExpression'
  operator: string
  left: acorn.Node
  right: acorn.Node
}
export interface LogicalExpressionNode extends acorn.Node {
  type: 'LogicalExpression'
  operator: string
  left: acorn.Node
  right: acorn.Node
}
export interface BinaryExpressionNode extends acorn.Node {
  type: 'BinaryExpression'
  operator: string
  left: acorn.Node
  right: acorn.Node
}
export interface IdentifierNode extends acorn.Node {
  type: 'Identifier'
  name: string
}
export interface TemplateElementNode extends acorn.Node {
  type: 'TemplateElement'
  value: {
    raw: string
    cooked: string | null
  }
  tail: boolean
}
export interface ArrayExpressionNode extends acorn.Node {
  type: 'ArrayExpression'
  elements: (acorn.Node | null)[]
}
export interface TemplateLiteralNode extends acorn.Node {
  type: 'TemplateLiteral'
  expressions: acorn.Node[]
  quasis: TemplateElementNode[]
}
export interface ObjectExpressionNode extends acorn.Node {
  type: 'ObjectExpression'
  properties: acorn.Node[]
}
export interface PropertyNode extends acorn.Node {
  type: 'Property'
  method: boolean
  kind: string
  shorthand: boolean
  key: acorn.Node
  value: acorn.Node
}
export interface ArrowFunctionExpressionNode extends acorn.Node {
  type: 'ArrowFunctionExpression'
  id: any | null
  expression: boolean
  generator: boolean
  async: boolean
  params: acorn.Node[]
  body: BlockStatementNode
}
export interface FunctionExpressionNode extends acorn.Node {
  type: 'FunctionExpression'
  id: IdentifierNode | null
  expression: boolean
  generator: boolean
  async: boolean
  params: acorn.Node[]
  body: BlockStatementNode
}
export interface LiteralNode extends acorn.Node {
  type: 'Literal'
  raw: string
  value: any
}
export interface IfStatementNode extends acorn.Node {
  type: 'IfStatement'
  consequent: acorn.Node
  test: acorn.Node
  alternate: unknown
}
export interface MemberExpressionNode extends acorn.Node {
  type: 'MemberExpression'
  object: acorn.Node
  property: acorn.Node
  computed: unknown
  optional?: acorn.Node
}
export interface NewExpressionNode extends acorn.Node {
  type: "NewExpression"
  callee: acorn.Node
  arguments: acorn.Node[]
}
export interface ChainExpressionNode extends acorn.Node {
  type: "ChainExpression"
  expression: MemberExpressionNode
}
export interface ReturnStatementNode extends acorn.Node {
  type: "ReturnStatement"
  argument: acorn.Node
}
export interface ThisExpressionNode extends acorn.Node {
  type: "ThisExpression"
}
export interface VariableDeclarationNode extends acorn.Node {
  type: 'VariableDeclaration'
  declarations: acorn.Node[]
  kind: 'const' | 'let' | 'var' | unknown
}
export interface VariableDeclaratorNode extends acorn.Node {
  type: 'VariableDeclarator'
  id: acorn.Node
  init: acorn.Node
}
export interface BlockStatementNode extends acorn.Node {
  type: 'BlockStatement'
  body: acorn.Node[]
}

export interface ProgramNode extends acorn.Node {
  type: 'Program'
  body: acorn.Node[]
  sourceType: string
}
