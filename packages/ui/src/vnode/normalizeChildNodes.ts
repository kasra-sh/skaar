import {VNodeContainer} from "./base/VNodeContainer";
import {VNode} from "./base/VNode";
import {transformNodeArray} from "./transformNodeArray";
import {VText} from "./VText";

export function normalizeChildNodes(nodes: any, arrayTransform: (a: Array<any>) => VNodeContainer, parentNode?: VNodeContainer): VNode[] {
    if (nodes === undefined || nodes === null) {
        nodes = []
    }
    if (nodes.length === 0) return nodes

    if (!Array.isArray(nodes)) nodes = [nodes]

    const normalized = Array<VNode>()

    for (let node of nodes) {
        if (Array.isArray(node)) {
            node = transformNodeArray(node)
        }

        if (!node || !node._type) {
            node = new VText('' + node)
        }

        node._parent = parentNode
        normalized.push(node)
    }

    return normalized
}