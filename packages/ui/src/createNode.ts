import {VElement, VElementProps} from "./vnode/VElement";
import {VNode} from "./vnode/VNode";
import {Fragment} from "./vnode/Fragment";
import {Component, ComponentClass} from "./component/Component";
import {JsObject} from "../global";
import {createVElement} from "./vnode/createVElement";
import {cloneComponent, createComponent} from "./component/createComponent";
import {cloneFnComponent, FnComponent} from "@skaar/ui/src/component/FnComponent";

export function createNode(type: string, props?: VElementProps, children?: (VNode | string | unknown)[]): VElement;
export function createNode(type: ComponentClass | Component, props?: JsObject, children?: (VNode | string | unknown)[]): Component;
export function createNode(type: Function, props?: JsObject, children?: (VNode | string | unknown)[]): FnComponent;
export function createNode(type: null, props: null | undefined, children?: (VNode | string | unknown)[]): Fragment;
export function createNode(type: null | string | ComponentClass | Component | Function, props?: VElementProps | JsObject, children?: (VNode | string | unknown)[])
    : Fragment | VElement | Component {

    if (children === null || children === undefined) {
        children = []
    }
    if (!Array.isArray(children)) {
        children = [children]
    }
    if (type === null) {
        return new Fragment(children)
    }
    if (typeof type === "string") {
        return createVElement(type, props as VElementProps, children)
    }
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