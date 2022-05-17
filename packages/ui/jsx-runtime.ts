import {createNode} from "./src/createNode"
import {VElement, VElementProps} from "./src/vnode/VElement";
import {VNode} from "./src/vnode/VNode";
import {Component, ComponentClass} from "./src/component/Component";
import {JsObject} from "./global";
import {createComponent} from "./src/component/createComponent";
import {Fragment} from "./src/vnode/Fragment";
import {createVElement} from "./src/vnode/createVElement";
import {translateJsxProperties} from "./src/translateJsxProperties";

export function jsx(p1, p2, key) {
    if (p2 && p2.children && !Array.isArray(p2.children)) p2.children = [p2.children];

    return jsxs(p1, p2, key)
}

export function jsxs(p1, p2, key) {
    if (p2) p2.key = key;
    return createNode(p1, translateJsxProperties(p2), p2.children)
}

export function createElement(type: string, props: VElementProps, ...children: (VNode | string | unknown)[]): VElement;
export function createElement(type: ComponentClass, props: JsObject, ...children: (VNode | string | unknown)[]): Component;
export function createElement(type: null, props: null | undefined, ...children: (VNode | string | unknown)[]): Fragment;
export function createElement(type: null | string | ComponentClass, props: VElementProps | JsObject, ...children: (VNode | string | unknown)[])
    : Fragment | VElement | Component {
    if (type === null) {
        return new Fragment(children)
    }
    if (typeof type === "string") {
        return createVElement(type, props as VElementProps, children)
    }
    return createComponent(type, props, children)

}