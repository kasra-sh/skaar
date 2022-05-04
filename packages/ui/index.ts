import {DomRenderer} from "./src/view-dom/DomRenderer";
import {DomApi} from "./src/view-dom/DomApi";

export * from './src/createNode'
export {Component} from './src/component/Component'
export {PureComponent} from './src/component/PureComponent'
export {useState, useEffect, UseStateTuple, EffectFn} from './src/component/Hooks'
const domRenderer = new DomRenderer(new DomApi(document))

export const SkaarDOM = {
    domRenderer: domRenderer,
    render: domRenderer.render.bind(domRenderer) as DomRenderer["render"]
}