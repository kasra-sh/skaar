import {T_TEXT, VNode} from "./VNode";

export class VText extends VNode {
    override _type = T_TEXT
    _viewNode: any

    override _unmount(remove: boolean): VNode | undefined {
        if (remove !== false) this._viewNode.remove()
        return this._viewNode
    }

    props: string

    _parentViewNode() {
        return this._parent._viewNode || this._parent._parentViewNode();
    }

    _firstViewNodeAfter(child) {
        console.error("!!! VText is expected to be parent of", child);
    }

    constructor(text) {
        super()
        this.props = text
    }
}
