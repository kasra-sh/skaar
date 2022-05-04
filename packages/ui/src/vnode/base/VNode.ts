import {IViewNode} from "@skaar/ui/src/view/NodeTypes";

export const T_TEXT = 10
export const T_ELEMENT = 20
export const T_FRAGMENT = 30
export const T_LIST = 35
export const T_CLASS_COMPONENT = 40
export const T_FN_COMPONENT = 45

export type ViewEngineInstance = {
    remove(view: any): void
}

const NoopViewEngine = {
    remove() {
        throw Error("Calling NoopViewEngine method remove()")
    }
}

export abstract class VNode {
    abstract _type: number
    abstract _viewNode: IViewNode | undefined
    __viewApi: ViewEngineInstance = NoopViewEngine
    abstract props?: any

    abstract _unmount(remove?: boolean): IViewNode | undefined

    _parent?: VNode
    _cleaners: Array<(node: VNode) => void> = []

    _cleanup(): void {
        for (const cc of this._cleaners) {
            cc(this)
        }
    }

    _parentViewNode(): IViewNode | undefined {
        return this._parent && (this._parent._viewNode || this._parent._parentViewNode())
    }

    _firstViewNode(): IViewNode | undefined {
        return this._viewNode
    }

    _firstViewNodeAfter(child: VNode): IViewNode | undefined {
        return this._viewNode
    }

    _nextSiblingViewNode(): IViewNode | undefined {
        return this._parent && this._parent._firstViewNodeAfter(this)
    }

    toString() {
        return ''
    }
}