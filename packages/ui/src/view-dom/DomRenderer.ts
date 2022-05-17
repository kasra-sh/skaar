import {Component} from "../component/Component";
import {VText} from "../vnode/VText";
import {T_CLASS_COMPONENT, T_ELEMENT, T_FN_COMPONENT, T_FRAGMENT, T_LIST, T_TEXT, VNode} from "../vnode/VNode";
import {Fragment} from "../vnode/Fragment";
import {List} from "../vnode/List";
import {VElement} from "../vnode/VElement";
import {DomApi} from "./DomApi";
import {JsObject} from "../../global";
import {createVElement} from "../vnode/createVElement";
import {globalScope} from "../globalScope";
import {warnListItemsWithoutKey} from "../debug/warnings";
import {VNodeContainer} from "../vnode/VNodeContainer";
import {IComponentUpdater} from "@skaar/ui/src/component/IComponentUpdater";
import {FnComponent} from "@skaar/ui/src/component/FnComponent";
import {IViewRenderer} from "@skaar/ui/src/view/IViewRenderer";

// const hasRAF = typeof globalScope.requestAnimationFrame === "function";
// const hasQMT = typeof globalScope.queueMicrotask === "function";
// const enqueueUpdateTask = globalScope.queueMicrotask || globalScope.requestAnimationFrame || setTimeout
const requestAnimationFrame = globalScope.requestAnimationFrame

// const enqueueUpdateTask = setTimeout

export class DomRenderer implements IViewRenderer, IComponentUpdater {
    viewApi: DomApi

    constructor(view: DomApi) {
        this.viewApi = view
    }

    setViewNodeAttribute(domNode, key, value) {
        // noinspection FallThroughInSwitchStatementJS
        switch (key) {
            case 'ref':
                value.current = domNode
                break
            case 'value':
                this.viewApi.setValue(domNode, value)
                break
            case 'className':
                key = 'class'
            default:
                this.viewApi.setAttribute(domNode, key, value)
        }
    }

    setVElementAttributes(vElement: VElement) {
        const attrs = vElement.props.attrs

        if (!attrs) return
        for (const attrsKey in attrs) {
            this.setViewNodeAttribute(vElement._viewNode, attrsKey, attrs[attrsKey])
        }
    }

    setVElementEvents(vElement: VElement, parentComponent: Component | FnComponent): Array<{ name: string, func: VoidFunction }> {
        const appliedEvents = Array<{ name: string, func: VoidFunction }>()
        for (const propKey in vElement.props.events) {
            const eventName = propKey
            const eventFn: Function = vElement.props.events[propKey]

            const wrapperFn = function onEvent(event) {
                return eventFn.apply(parentComponent, [event, vElement._viewNode, parentComponent])
            }.bind(parentComponent)

            this.viewApi.addEventListener(vElement._viewNode, eventName, wrapperFn)

            appliedEvents.push({name: eventName, func: wrapperFn})
        }

        vElement._cleaners.push(() => {
            for (const ae of appliedEvents) {
                this.viewApi.removeEventListener(vElement._viewNode, ae.name, ae.func)
            }
        })
        return appliedEvents
    }

    updateVElementEvents(newEl: VElement, oldEl: VElement, parentComponent: Component | FnComponent) {
        if (JSON.stringify(newEl.props.events) === JSON.stringify(oldEl.props.events))
            return
        oldEl._cleanup()
        this.setVElementEvents(newEl, parentComponent)
    }

    updateVElementAttributes(newEl: VElement, oldEl: VElement) {
        const oldAttrs = oldEl.props.attrs || {};
        const newAttrs = newEl.props.attrs || {};

        if (JSON.stringify(oldAttrs) === JSON.stringify(newAttrs)) return;

        const newKeys = [];
        for (const key in newAttrs) {
            newKeys.push(key);
            const newVal = newAttrs[key];
            const oldVal = oldAttrs[key];
            if (!(oldVal && newVal === oldVal)) {
                this.setViewNodeAttribute(newEl._viewNode, key, newVal);
            }
        }
        for (const key in oldAttrs) {
            if (newKeys.indexOf(key) < 0) {
                this.viewApi.removeAttribute(newEl._viewNode, key);
            }
        }
    }

    /*
    ** Render
    */

    renderVText(vnode: VText): any {
        return vnode._viewNode = this.viewApi.createTextNode(vnode.props)
    }

    // noinspection JSUnusedLocalSymbols
    private renderChildNodes(nodes: VNode[], parentNode, parentComponent?: Component | FnComponent): any[] {
        const renderedNodes = Array<Node>()
        if (!Array.isArray(nodes)) {
            return []
        }
        for (const node of nodes) {
            let dom = this.renderVNode(node, parentComponent)
            if (Array.isArray(dom)) {
                renderedNodes.push(...dom)
            } else {
                renderedNodes.push(dom)
            }
        }
        return renderedNodes
    }

    renderVElement(vnode: VElement, parentComponent?: Component | FnComponent): any {
        vnode.__viewApi = this.viewApi
        vnode._viewNode = this.viewApi.createElement(vnode._tag)
        this.setVElementAttributes(vnode)
        this.setVElementEvents(vnode, parentComponent)
        const domNodes = this.renderChildNodes(vnode._childNodes, vnode, parentComponent)
        this.viewApi.append(vnode._viewNode, domNodes);
        return vnode._viewNode
    }

    renderFragment(vnode: Fragment, parentComponent: Component | FnComponent) {
        return this.renderChildNodes(vnode._childNodes, vnode, parentComponent)
    }

    renderList(vnode: List, parentComponent: Component | FnComponent) {
        if (!vnode.everyChildHasKeyProp()) {
            warnListItemsWithoutKey(vnode)
        }
        return this.renderChildNodes(vnode._childNodes, vnode, parentComponent)
    }

    renderComponent(component: FnComponent | Component, parentComponent?: Component | FnComponent): any[] {
        component.__updater = this
        const nodes = component._childNodes = component._invokeRender()
        let viewNodes = []
        for (const node of nodes) {
            let rendered = this.renderVNode(node, component)

            if (Array.isArray(rendered)) {
                viewNodes = viewNodes.concat(rendered)
            } else {
                viewNodes.push(rendered)
            }
        }
        if (parentComponent) {
            /*
            Pass context
             */
        }
        component.__internal.mounted = true
        return viewNodes
    }

    renderVNode(vnode: VNode, parentComponent?: Component | FnComponent) {
        switch (vnode._type) {
            case T_TEXT:
                return this.renderVText(vnode as VText)
            case T_ELEMENT:
                return this.renderVElement(vnode as VElement, parentComponent)
            case T_FRAGMENT:
                return this.renderFragment(vnode as Fragment, parentComponent)
            case T_LIST:
                return this.renderList(vnode as List, parentComponent)
            case T_CLASS_COMPONENT:
                return this.renderComponent(vnode as any, parentComponent)
            case T_FN_COMPONENT:
                return this.renderComponent(vnode as any, parentComponent)
            default:
                throw Error(`Node type ${vnode._type} not implemented!`)
        }
    }

    /*
    ** Update
    */

    private _appendChildNodes(extraDomNodes, parentVNode: VNode, rootDom) {
        if (parentVNode && parentVNode._viewNode) {
            this.viewApi.append(parentVNode._viewNode, extraDomNodes);
        } else {
            let nextDom = (parentVNode && parentVNode._nextSiblingViewNode());
            if (nextDom) {
                extraDomNodes = extraDomNodes.reverse();
                while (extraDomNodes.length > 0) {
                    this.viewApi.insertBefore(nextDom, extraDomNodes.pop());
                }
            } else {
                if (rootDom) {
                    this.viewApi.append(rootDom, extraDomNodes);
                } else {
                    throw Error(`No parent dom found! parentNode: ${parentVNode}, nextDom: ${nextDom}, rootDom: ${rootDom}`);
                }
            }
        }
    }

    private _replaceChildNode(newNode: VNode, oldNode: VNode, rootDom: HTMLElement, parentComponent: Component | FnComponent) {
        let oldDomNode = oldNode._viewNode || oldNode._firstViewNode();

        const newDom = this.renderVNode(newNode, parentComponent);

        //DOM
        if (oldDomNode) {
            this.viewApi.replaceWith(oldDomNode, newDom);
        } else {
            oldDomNode = oldNode._nextSiblingViewNode();
            if (oldDomNode) {
                let placeHolder = this.viewApi.createElement('script');
                this.viewApi.insertBefore(oldDomNode, placeHolder);
                this.viewApi.replaceWith(placeHolder, newDom);
            } else {
                if (!rootDom) throw Error(`No parent dom found! oldNode: ${oldNode}, newNode: ${newNode}`);

                this.viewApi.append(rootDom, newDom);

            }
        }
        oldNode._unmount();
    }

    updateChildNodes(newNodes: VNode[], oldNodes: VNode[], parentVNode: VNode, rootDom: HTMLElement, parentComponent?: Component | FnComponent) {
        const isList = (parentVNode && (parentVNode._type === T_LIST))
        newNodes = newNodes || []
        oldNodes = oldNodes || []
        newNodes = Array.isArray(newNodes) ? newNodes : [newNodes]
        oldNodes = Array.isArray(oldNodes) ? oldNodes : [oldNodes]

        const newCount = newNodes.length, oldCount = oldNodes.length

        let idx = 0
        while (idx < oldCount && idx < newCount) {
            const newNode: VText | VElement | Component | VNode = newNodes[idx]
            const oldNode: VText | VElement | Component | VNode = oldNodes[idx]

            const sameType = newNode._type === oldNode._type

            if (!sameType) {
                this._replaceChildNode(newNode, oldNode, rootDom, parentComponent)
                idx++
                continue
            }

            const newType = newNode._type

            switch (newType) {
                case T_TEXT: {
                    this.updateVText(<VText>newNode, <VText>oldNode)
                    break
                }
                case T_ELEMENT: {
                    if ((<VElement>newNode)._tag === (<VElement>oldNode)._tag) {
                        this.updateVElement(newNode, oldNode, parentComponent)
                    } else {
                        this._replaceChildNode(newNode, oldNode, rootDom, parentComponent)
                    }
                    break;
                }
                case T_FRAGMENT: {
                    this.updateFragment(newNode, oldNode, parentVNode, rootDom, parentComponent)
                    break;
                }
                case T_LIST: {
                    this.updateList(newNode, oldNode, parentVNode, rootDom, parentComponent)
                    break;
                }
                case T_CLASS_COMPONENT: {
                    if (isList) {
                        if (oldNode.props.key === undefined || (oldNode.props.key !== newNode.props.key)) {
                            this._replaceChildNode(newNode, oldNode, rootDom, parentComponent);
                            break;
                        }
                    }
                    if ((<Component>oldNode)._isSameComponentType(newNode as Component)) {
                        newNodes[idx] = this.updateChildComponent(<Component>oldNode, <Component>newNode)
                    } else {
                        this._replaceChildNode(newNode, oldNode, rootDom, parentComponent);
                    }
                    break;
                }
                case T_FN_COMPONENT: {
                    if (isList) {
                        if (oldNode.props.key === undefined || (oldNode.props.key !== newNode.props.key)) {
                            this._replaceChildNode(newNode, oldNode, rootDom, parentComponent);
                            break;
                        }
                    }
                    if ((<Component>oldNode)._isSameComponentType(newNode as Component)) {
                        newNodes[idx] = this.updateChildComponent(<Component>oldNode, <Component>newNode)
                    } else {
                        this._replaceChildNode(newNode, oldNode, rootDom, parentComponent);
                    }
                    break;
                }
                default:
                    throw Error(`Cannot patch node type ${newType}`);
            }
            idx++;
        }

        // remove old nodes
        if (newCount < oldCount) {
            //DOM
            for (let i = newCount; i < oldCount; i++) {
                oldNodes[i]._unmount();
            }
        }

        // append new nodes
        if (newCount > oldCount) {
            let extraDomNodes = [];
            let node;
            for (let i = oldCount; i < newCount; i++) {
                node = newNodes[i];
                let dom = this.renderVNode(node, parentComponent);
                if (Array.isArray(dom)) {
                    extraDomNodes.push(...dom);
                } else {
                    extraDomNodes.push(dom);
                }
            }
            this._appendChildNodes(extraDomNodes, parentVNode, rootDom);
        }
    }

    updateFragment(newFrag, oldFrag, parentVNode, rootDom, parentComponent) {
        this.updateChildNodes(newFrag._childNodes, oldFrag._childNodes, oldFrag, rootDom, parentComponent)
    }

    updateList(newList, oldList, parentVNode, rootDom, parentComponent) {
        this.updateChildNodes(newList._childNodes, oldList._childNodes, oldList, rootDom, parentComponent)
    }

    updateVElement(newEl, oldEl, parentComponent) {
        newEl.__viewApi = this.viewApi
        newEl._viewNode = oldEl._viewNode;
        this.updateVElementAttributes(newEl, oldEl);
        this.updateVElementEvents(oldEl, newEl, parentComponent);
        this.updateChildNodes(newEl._childNodes, oldEl._childNodes, oldEl, newEl._viewNode, parentComponent);
    }

    updateVText(newTxt: VText, oldTxt: VText) {
        newTxt.__viewApi = this.viewApi
        newTxt._viewNode = oldTxt._viewNode

        if (oldTxt.props !== newTxt.props) {
            this.viewApi.setText(newTxt._viewNode, newTxt.props);
        }
    }

    updateChildComponent(childComponent: Component | FnComponent, newChildComponent: Component | FnComponent) {
        childComponent.__updater = this
        childComponent._parent = newChildComponent._parent
        const oldProps = childComponent.props;
        childComponent._setProps(newChildComponent.props)
        if (!childComponent._shouldUpdate(oldProps, newChildComponent.props, null, null)) {
            return childComponent
        }
        this.scheduleUpdate(childComponent)
        return childComponent
    }

    /*
    ** Component Update Scheduler
     */
    updateQueue = Array<{ partialState: JsObject, component: Component | FnComponent, mergeCount: number }>()
    isUpdating = false
    isDisposed = false
    timeout = 15

    applyUpdates(callback) {
        let update;
        let updateStart = Date.now()
        let count = this.updateQueue.length
        let updatedCount = 0
        let reSchedule = false
        let elapsed
        if (count > 0) {
            while (!this.isDisposed && (update = this.updateQueue.shift())) {
                this.updateNow(update.component, update.partialState)
                updatedCount++
                elapsed = Date.now() - updateStart
                if (this.updateQueue.length > 0 && elapsed >= this.timeout) {
                    reSchedule = true
                    break
                }
            }
        }

        if (reSchedule) {
            setTimeout(() => this.applyUpdates(callback))
        } else {
            callback()
        }
    }

    startUpdating() {
        if (!this.isUpdating) {
            this.isUpdating = true
            const callback = (() => {
                this.isUpdating = false
            })
            if (requestAnimationFrame)
                requestAnimationFrame(() => this.applyUpdates(callback))
            else setTimeout(() => this.applyUpdates(callback))
        }
    }

    scheduleUpdate = (component: Component | FnComponent, partialState?: JsObject): void => {
        if (!component._isMounted()) return

        // experimental batching
        // try to merge consecutive updates of the same component
        let skip = false
        if (partialState) {
            const last = this.updateQueue[this.updateQueue.length - 1]
            if (last && last.mergeCount < 5 && last.component === component && last.partialState && partialState) {
                Object.assign(last.partialState, partialState)
                skip = true
            }
        }

        if (!skip) {
            this.updateQueue.push({component, partialState, mergeCount: 0})
        }

        this.startUpdating()
    }

    updateNow = (component: Component | FnComponent, partialState?: JsObject): void => {
        if (!component._isMounted()) {
            return
        }
        if (component._type === T_FN_COMPONENT) {
            const newChildNodes = component._invokeRender();
            this.updateChildNodes(newChildNodes, component._childNodes, component, component._parentViewNode(), component)
            component._childNodes = newChildNodes
            return;
        }
        if (partialState) {
            (<Component>component).setState(partialState, true)
        }
        (<Component>component)._callLifecycleMethod('onUpdate')
        const newChildNodes = component._invokeRender();
        this.updateChildNodes(newChildNodes, component._childNodes, component, component._parentViewNode(), component)
        component._childNodes = newChildNodes
    }

    render(vnode: VNode | VNodeContainer, viewNode: HTMLElement) {
        this.viewApi.clearChildren(viewNode);
        this.viewApi.getAttributeNames(viewNode);
        vnode = createVElement(viewNode.tagName, {}, [vnode]) as VNodeContainer
        const rendered = this.renderChildNodes((<VNodeContainer>vnode)._childNodes, vnode)
        this.viewApi.append(viewNode, rendered)
    }

    dispose() {
        this.updateQueue = []
        this.isDisposed = true
    }
}