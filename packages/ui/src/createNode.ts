import {VElement, VElementProps} from "./vnode/VElement";
import {VNode} from "./vnode/VNode";
import {Fragment} from "./vnode/Fragment";
import {Component, ComponentClass} from "./component/Component";
import {JsObject} from "../global";
import {createVElement} from "./vnode/createVElement";
import {cloneComponent, cloneFnComponent, createComponent} from "./component/createComponent";
import {FnComponent} from "./component/FnComponent";
import {transformJsxProperties} from "../src/transformJsxProperties";


export function createComponentNode(type: Function | ComponentClass | Component, props?: JsObject, children?: (VNode | string | unknown)[])
    : Component | FnComponent {
    if (typeof type === "function") {
        if (!type['_str']) {
            type['_str'] = type.toString()
        }
        if (type['_str'][0] === 'c')
            return createComponent(type as ComponentClass, props, children)
        else
            return cloneFnComponent(type, props, children)
    } else {
        return cloneComponent(type, props, children)
    }
}

export function createNode(type: string, props?: VElementProps, children?: (VNode | string | unknown)[], jsxTransformProps?: boolean): VElement;
export function createNode(type: ComponentClass | Component, props?: JsObject, children?: (VNode | string | unknown)[], jsxTransformProps?: boolean): Component;
export function createNode(type: Function, props?: JsObject, children?: (VNode | string | unknown)[], jsxTransformProps?: boolean): FnComponent;
export function createNode(type: null | undefined, props: null | undefined, children?: (VNode | string | unknown)[], jsxTransformProps?: boolean): Fragment;
export function createNode(
    type: null | undefined | string | ComponentClass | Component | Function,
    props?: VElementProps | JsObject, children?: (VNode | string | unknown)[],
    jsxTransformProps?: boolean
): Fragment | VElement | Component {

    if (children === null || children === undefined) {
        children = []
    }
    if (!Array.isArray(children)) {
        children = [children]
    }
    if (type === null || type === undefined) {
        return new Fragment(children)
    }
    if (typeof type === "string") {
        return createVElement(type, jsxTransformProps? transformJsxProperties(props): props, children)
    }

    return createComponentNode(type, props, children)
}