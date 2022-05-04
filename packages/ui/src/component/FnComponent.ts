import {VNodeContainer} from "../vnode/VNodeContainer";
import {T_FN_COMPONENT, VNode} from "../vnode/VNode";
import {normalizeChildNodes} from "../vnode/normalizeChildNodes";
import {transformNodeArray} from "../vnode/transformNodeArray";
import {warnRecursiveRender} from "@skaar/ui/src/debug/warnings";
import {ComponentInternal, ComponentProps} from "@skaar/ui/src/component/Component";
import {IComponentUpdater, NoopUpdater} from "@skaar/ui/src/component/IComponentUpdater";

export type HookNode = {
    next?: HookNode,
    data: any
}

export type FncRenderContext = {
    component: FnComponent,
    hookNode?: HookNode
}

type FunctionalComponentContext = {
    stack: Array<FncRenderContext>,
    current?: FncRenderContext,
    enter: (component: any) => void
    leave: () => void
}
export const FncContext: FunctionalComponentContext = {
    stack: Array<FncRenderContext>(),
    current: undefined as FncRenderContext,
    enter(component: FnComponent) {
        const ctx: FncRenderContext = {
            component
        }
        this.stack.push(ctx)
        this.current = ctx
    },
    leave() {
        this.current = this.stack.pop()
    }
}

export class FnComponent extends VNodeContainer {
    override _type = T_FN_COMPONENT
    override _viewNode: never
    override _childNodes: any
    override props: ComponentProps

    renderFunction: Function
    hookNode: HookNode
    _name: string
    __internal: ComponentInternal = {dirty: true, rendering: false}
    __updater: IComponentUpdater = NoopUpdater

    override _unmount(remove?: boolean): VNode | undefined {
        this.__internal.mounted = false
        this._cleanup()
        return super._unmount(remove)
    }

    override _cleanup() {
        this.__internal.disposed = true
        super._cleanup()
    }

    _setProps(newProps: ComponentProps) {
        this.props = Object.assign(this.props || {}, newProps)
    }

    _invokeRender(): VNode[] {
        this.__internal.rendering = true
        let nodes = undefined
        let reps = 0
        let warned = false
        do {
            this.__internal.dirty = false
            FncContext.enter(this)
            nodes = normalizeChildNodes(this.renderFunction(this.props), transformNodeArray, this)
            FncContext.leave()
            if ((!warned) && (reps++ > 99)) {
                warnRecursiveRender(this)
                warned = true
                break
            }
        } while (this.__internal.dirty)

        if (this.__internal.dirty) {
            if (!this.__internal.mounted) {
                if (!this.__internal.disposed) {
                    setTimeout(() => {
                        this.__updater.updateNow(this)
                    })
                }
            } else {
                this.__updater.scheduleUpdate(this)
            }
        }
        this.__internal.rendering = false
        return nodes
    }

    _shouldUpdate(props?, newProps?, state?, newState?) {
        return true
    }

    _isSameComponentType(component: FnComponent) {
        return this.renderFunction === component.renderFunction
    }

    _isMounted(): boolean {
        return !this.__internal.disposed && !this.__internal.destroyed && this.__internal.mounted
    }

    constructor(fn) {
        super()
        this.renderFunction = fn
        this._name = fn.name === '' ? "AnonFNC" : fn.name
    }

    override toString(): string {
        return '[Component<' + this._name + '>]'
    }
}

export function cloneFnComponent(fn: Function, props, children) {
    if (!fn['_createInstance']) {
        const proto = fn['_proto'] = new FnComponent(fn)
        fn['_createInstance'] = function () {
            const instance = Object.assign({}, proto)
            Object.setPrototypeOf(instance, Object.getPrototypeOf(proto))
            instance.props = {...props, children}
            instance.hookNode = undefined
            return instance
        }
    }
    return fn['_createInstance']()
}