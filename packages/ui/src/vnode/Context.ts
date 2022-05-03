// import {Component, ComponentProps} from "./Component";
// import {JsObject} from "../../global";
import {createObjComponent} from "./createComponent";


export function createContext(defaultValue: any) {
    const context = {}
    const providers = []
    const Provider = createObjComponent({
        _name: 'ContextProvider',
        state: {
            value: defaultValue
        },
        onCreate() {
            providers.push(this)
        },
        onUpdate(props) {
            if (this.state.value !== props) {
                this.setState({
                    value: props
                })
            }
        },
        __context: context,
        render(props) {
            return props.children
        }
    })
    const Consumer = createObjComponent({
        _name: 'ContextConsumer',

        onDestroy() {
        },

        render({children}) {
            let value = undefined
            let parent = this._parent
            while (parent) {
                const parentCtx = parent.__context
                if (parentCtx && parentCtx === context) {
                    value = parent.state.value
                    break
                }
                parent = parent._parent
            }
            children = children || []
            const ch = []
            for (let child of children) {
                if (typeof child === "function" && (child.toString().indexOf('class ') !== 0)) {
                    ch.push(child(value))
                }
            }
            return ch
        }
    })
    return {
        Provider,
        Consumer
    }
}