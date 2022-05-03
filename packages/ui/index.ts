import {DomRenderer} from "./src/view/dom-view/DomRenderer";
import {DomApi} from "./src/view/dom-view/DomApi";

export * from './src/createNode'
export {Component} from './src/vnode/Component'
export {PureComponent} from './src/vnode/PureComponent'
export {useState, useEffect, UseStateTuple, EffectFn} from './src/vnode/Hooks'
const domRenderer = new DomRenderer(new DomApi(document))

export const SkaarDOM = {
    domRenderer: domRenderer,
    render: domRenderer.render.bind(domRenderer) as DomRenderer["render"]
}