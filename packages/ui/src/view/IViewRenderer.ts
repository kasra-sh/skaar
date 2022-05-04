import {DomApi} from "@skaar/ui/src/view-dom/DomApi";
import {Component} from "@skaar/ui/src/component/Component";
import {VElement} from "@skaar/ui/src/vnode/VElement";
import {VText} from "@skaar/ui/src/vnode/VText";
import {VNode} from "@skaar/ui/src/vnode/VNode";

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