import {T_CLASS_COMPONENT, VNode} from "./base/VNode";
import {transformNodeArray} from "./transformNodeArray";
import {normalizeChildNodes} from "./normalizeChildNodes";
import {JsObject} from "../../global";
import {VNodeContainer} from "./base/VNodeContainer";
import {warnRecursiveRender} from "../debug/warnings";
import {FnComponent} from "./FnComponent";
import {ComponentUpdater, NoopUpdater} from "@skaar/ui/src/vnode/ComponentUpdater";

export type ComponentInternal = {
    dirty: boolean,
    rendering: boolean,
    mounted?: boolean,
    destroyed?: boolean,
    disposed?: boolean
}

export type ComponentProps = { children?: any[] } & JsObject;

export abstract class Component extends VNodeContainer {
    override _type = T_CLASS_COMPONENT
    override _viewNode: never
    override _childNodes: any
    override props: ComponentProps
    public state: JsObject

    _proto: FunctionConstructor
    _name: string
    __internal: ComponentInternal = {dirty: true, rendering: false}
    __updater: ComponentUpdater = NoopUpdater

    onCreate?(): void;

    onDestroy?(): void;

    onMount?(): void;

    onUpdate?(props: ComponentProps): void;

    abstract render(props: ComponentProps, state: JsObject): any

    override _unmount(remove?: boolean): VNode | undefined {
        this.__internal.mounted = false
        this._cleanup()
        return super._unmount(remove)
    }

    override _cleanup() {
        this.__internal.disposed = true
        this._callLifecycleMethod('onDestroy', true)
        super._cleanup()
    }

    _setProps(newProps: ComponentProps) {
        this.props = Object.assign(this.props || {}, newProps)
    }

    setState(partialState?: JsObject, dontUpdate?: boolean) {
        if (this.state && partialState && !dontUpdate) Object.assign(this.state, partialState)
        if (this.__internal.rendering) {
            this.__internal.dirty = true
        } else if (!dontUpdate && this.__updater !== NoopUpdater) {
            this.__updater.scheduleUpdate(this, partialState)
        }
    }

    _invokeRender(): VNode[] {
        this.__internal.rendering = true
        let nodes = undefined
        let reps = 0
        let warned = false
        do {
            this.__internal.dirty = false
            nodes = normalizeChildNodes(this.render(this.props, this.state), transformNodeArray, this)
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
                        this.__updater.scheduleUpdate(this)
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

    _isSameComponentType(component: Component) {
        return this._proto === component._proto
    }

    _isMounted(): boolean {
        return !this.__internal.disposed && !this.__internal.destroyed && this.__internal.mounted
    }

    _callLifecycleMethod(method: 'onCreate' | 'onMount' | 'onDestroy' | 'onUpdate', defer = false) {
        if (defer) {
            setTimeout(() => {
                const lcMethod = this[method]
                lcMethod && lcMethod.call(this, this.props)
            })
        } else {
            try {
                const lcMethod = this[method]
                lcMethod && lcMethod.call(this, this.props)
            } catch (e) {
                console.error(this[method], e)
            }
        }
    }

    constructor() {
        super()
        this._proto = this.constructor as FunctionConstructor
        this._name = this.constructor.name
        this._callLifecycleMethod('onCreate', true)
    }

    override toString(): string {
        return '[Component<' + this._name + '>]'
    }
}

export type ComponentClass = new () => Component;
export type FnComponentClass = new () => FnComponent;