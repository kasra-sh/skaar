import {VElement, VElementProps} from "./vnode/VElement";
import {VNode} from "./vnode/VNode";
import {Fragment} from "./vnode/Fragment";
import {Component, ComponentClass} from "./component/Component";
import {JsObject} from "../global";
import {createVElement} from "./vnode/createVElement";
import {cloneComponent, createComponent} from "./component/createComponent";
import {translateJsxProperties} from "./translateJsxProperties";

export function h(type: string, props?: JsObject, children?: (VNode | string | unknown)[]): VElement;
export function h(type: ComponentClass | Component, props?: JsObject, children?: (VNode | string | unknown)[]): Component;
export function h(type: null, props: null | undefined, children?: (VNode | string | unknown)[]): Fragment;
export function h(type: null | string | ComponentClass | Component, props?: JsObject, children?: (VNode | string | unknown)[])
    : Fragment | VElement | Component {
    if (type === null) {
        return new Fragment(children)
    }
    if (typeof type === "string") {
        return createVElement(type, translateJsxProperties(props as VElementProps), children)
    }
    if (typeof type === "function")
        return createComponent(type, props, children)
    else {
        return cloneComponent(type, props, children)
    }

}