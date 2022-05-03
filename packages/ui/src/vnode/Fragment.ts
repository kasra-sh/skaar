import {VNodeContainer} from "./base/VNodeContainer";
import {T_FRAGMENT, VNode} from "./base/VNode";
import {normalizeChildNodes} from "./normalizeChildNodes";
import {transformNodeArray} from "./transformNodeArray";

export class Fragment extends VNodeContainer {
    props?: any;
    _type = T_FRAGMENT
    _childNodes: VNode[]
    override _viewNode: never

    constructor(nodes?: (VNode | string | unknown)[]) {
        super()
        this._childNodes = normalizeChildNodes(nodes, transformNodeArray, this)
    }
}