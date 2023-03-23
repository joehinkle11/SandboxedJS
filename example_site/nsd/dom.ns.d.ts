


declare function alert(message?: any): void;
declare function confirm(message?: string): boolean;
declare function prompt(message?: string, _default?: string): string | null;

declare function setInterval(handler: TimerHandler, timeout?: number, ...arguments: any[]): number;
declare function setTimeout(handler: TimerHandler, timeout?: number, ...arguments: any[]): number;
declare function clearInterval(id: number | undefined): void;
declare function clearTimeout(id: number | undefined): void;

declare const Function: FunctionConstructor;
type TimerHandler = Function;
interface FunctionConstructor {
    /**
     * Creates a new function.
     * @param args A list of arguments the function accepts.
     */
    new(...args: string[]): Function;
    (...args: string[]): Function;
    readonly prototype: Function;
}


declare const console: Console;

interface Console {
  log(...data: any[]): void;
}

declare const document: Document;

declare const Document: {
    prototype: Document;
    new(): Document;
};

interface Document extends Node, NonElementParentNode, ParentNode {
  body: HTMLElement;

  createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K];
  createTextNode(data: string): Text;
}
interface Text extends CharacterData {
}
// declare const Text: {
//   prototype: Text;
//   new(data?: string): Text;
// };
interface CharacterData extends Node, ChildNode, NonDocumentTypeChildNode {}
interface ElementCreationOptions {
}
interface HTMLElementTagNameMap {
  "p": HTMLParagraphElement;
}
interface HTMLParagraphElement extends HTMLElement {
}
// declare const HTMLParagraphElement: {
//   prototype: HTMLParagraphElement;
//   new(): HTMLParagraphElement;
// };

interface EventTarget {}
declare const EventTarget: {
  prototype: EventTarget;
  new(): EventTarget;
};


interface Node extends EventTarget {
  appendChild<T extends Node>(node: T): T;
  textContent: string | null;
}

interface ParentNode extends Node {

}

interface NonElementParentNode {
  /** Returns the first element within node's descendants whose ID is elementId. */
  getElementById(elementId: string): Element | null;
}

declare const Element: {
  prototype: Element;
  new(): Element;
};
interface Element extends Node, ChildNode, NonDocumentTypeChildNode, ParentNode {
}
interface ChildNode extends Node {
}
interface NonDocumentTypeChildNode {
    /** Returns the first following sibling that is an element, and null otherwise. */
    // readonly nextElementSibling: Element | null;
    /** Returns the first preceding sibling that is an element, and null otherwise. */
    // readonly previousElementSibling: Element | null;
}

interface HTMLElement extends Element, ElementCSSInlineStyle {
  innerText: string;
}

interface ElementCSSInlineStyle {
  readonly style: CSSStyleDeclaration;
}

declare const CSSStyleDeclaration: {
  prototype: CSSStyleDeclaration;
  new(): CSSStyleDeclaration;
};

/** An object that is a CSS declaration block, and exposes style information and various style-related methods and properties. */
interface CSSStyleDeclaration {
  backgroundColor: ColorString
  borderWidth: "thin" | "medium" | "thick";
}


type ColorString = "white" | "black" | "red" | "blue" | "green" | "pink" | "purple" | "orange"


declare function fetch(input: string, init?: RequestInit): Promise<Response>;

/** This Fetch API interface represents the response to a request. */
interface Response extends Body {
    readonly ok: boolean;
}


interface RequestInit {
  /** A BodyInit object or null to set request's body. */
  body?: string | null;
  /** A string to set request's method. */
  method?: RequestInitMethod;
}
type RequestInitMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
interface Body {
    json(): Promise<any>;
    text(): Promise<string>;
}

interface Promise<T> {
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: (() => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: (() => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): Promise<T>
}
