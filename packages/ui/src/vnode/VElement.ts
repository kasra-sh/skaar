import {T_ELEMENT, VNode} from "./VNode";
import {VNodeContainer} from "./VNodeContainer";
import {normalizeChildNodes} from "./normalizeChildNodes";
import {transformNodeArray} from "./transformNodeArray";
import {JsObject} from "../../global";

export type VElementProps = {
    attrs?: JsObject
    events?: { [name: string]: (event, element, state) => void }
    children?: (VNode | string | number)[]
}

export class VElement extends VNodeContainer {

    override _type = T_ELEMENT
    _viewNode: any

    _unmount(remove?: boolean): VNode | undefined {
        if (this._viewNode) {
            this.__viewApi.remove(this._viewNode)
        }
        this._unmountNodes(false)
        return this._viewNode
    }

    _firstViewNode() {
        return this._viewNode;
    }

    _parentViewNode() {
        return this._viewNode;
    }

    props: VElementProps
    declare _childNodes: any

    _tag: string

    constructor(tag: string, props: VElementProps) {
        super()
        this._tag = tag.toLowerCase()
        this.props = props || {}
        this._childNodes = normalizeChildNodes(props.children, transformNodeArray, this)
        this.props.children = undefined
    }
}