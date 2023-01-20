import { IViewElement, IViewText } from '@skaar/ui/src/view/NodeTypes';

export interface IViewApi<T extends IViewText, E extends IViewElement> {
   setAttribute(el: E, k: string, v: any): void;

   createTextNode(txt: string): T;

   createElement(tag: string): E;

   setValue(el: E, v: any): void;

   removeAttribute(el: E, k): void;

   setText(el: T, text: any): void;

   insertBefore(childDom: T | E, newChildDom: T | E): void;

   replaceWith(oldDomNode: T | E, newDom: T | E | T[] | E[]): void;

   append(parent: E, children: T | E | T[] | E[]): void;

   removeEventListener(el: T | E, ev: string, fn: VoidFunction): void;

   addEventListener(el: E, ev: string, fn: Function): void;

   remove(el: T | E): void;

   clearChildren(el: E): void;

   getAttributeNames(rootDom: E): string[];

   getAttribute(rootDom: E, attrName: string): string | undefined | null;
}
