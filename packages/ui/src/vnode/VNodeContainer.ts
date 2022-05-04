import {VNode} from "./VNode";
import {IViewNode} from "@skaar/ui/src/view/NodeTypes";

export abstract class VNodeContainer extends VNode {
    _childNodes: VNode[]

    _unmountNodes(remove?: boolean): VNode | undefined {
        let res: any
        let _return: any
        for (const child of this._childNodes) {
            child._cleanup()
            res = child._unmount(remove)
            if (!_return && res) {
                _return = res
            }
        }
        return _return
    }

    _unmount(remove?: boolean): VNode | undefined {
        this._cleanup()
        return this._unmountNodes(remove)
    }

    override _firstViewNodeAfter(child: VNode): IViewNode | undefined {
        const start = this._childNodes.indexOf(child) + 1;
        let domNode = undefined;

        // find next dom in child nodes
        for (let i = start; i < this._childNodes.length && !domNode; i++)
            domNode = this._childNodes[i]._firstViewNode();

        // if node is a collection and has no viewNode in children, try to find in parent
        if (!domNode && !this._viewNode) {
            domNode = this._nextSiblingViewNode();
        }

        return domNode;
    }

    _nextSiblingViewNode() {
        return this._parent && this._parent._firstViewNodeAfter(this);
    }
}