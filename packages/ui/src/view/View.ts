import {DomApi} from "./dom-view/DomApi";
import {Component} from "../vnode/Component";
import {VElement} from "../vnode/VElement";
import {VText} from "../vnode/VText";
import {VNode} from "../vnode/base/VNode";

export type IViewNode = any;

export interface IViewElement extends IViewNode {

}

export interface IViewText extends IViewNode {
    textContent: string
}

export interface IViewApi<T extends IViewText, E extends IViewElement> {
    setAttribute(el: E, k: string, v: any): void

    createTextNode(txt: string): T

    createElement(tag: string): E

    setValue(el: E, v: any): void

    removeAttribute(el: E, k): void

    setText(el: T, text: any): void

    insertBefore(childDom: T | E, newChildDom: T | E): void

    replaceWith(oldDomNode: T | E, newDom: T | E | T[] | E[]): void

    append(parent: E, children: T | E | T[] | E[]): void

    removeEventListener(el: T | E, ev: string, fn: VoidFunction): void

    addEventListener(el: E, ev: string, fn: Function): void

    remove(el: T | E): void

    clearChildren(el: E): void

    getAttributeNames(rootDom: E): string[]

    getAttribute(rootDom: E, attrName: string): string | undefined | null
}

export interface IViewNodeFactory<TextNodeType, ElementNodeType> {
    createTextNode(text: string): TextNodeType

    createElement(tag: string): ElementNodeType
}

export interface IViewRenderer {
    viewApi: DomApi;
    scheduleUpdate: (partialState: any, component: Component) => void;

    setViewNodeAttribute(domNode: void, key: void, value: void): void;

    setVElementAttributes(vElement: VElement): void;

    updateVElementAttributes(newEl: VElement, oldEl: VElement): void;

    setVElementEvents(vElement: VElement, parentComponent: Component): Array<{ name: string, func: Function }>;

    renderVText(vnode: VText): any;

    renderVElement(vnode: VElement, parentComponent: Component): any;

    renderComponent(component: Component, parentComponent: Component): any[];

    renderVNode(vnode: VNode, parentComponent: Component): void;
}