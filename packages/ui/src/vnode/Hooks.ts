import {FncContext} from "./FnComponent";

export type UseStateTuple<T> = [
    t: T,
    setT: (newVal?: T) => void
]

function getOrInitHookNode(defaultValue: any) {
    const currentContext = FncContext.current
    const currentComponent = FncContext.current.component

    // if empty return or initialize first node
    if (!currentContext.hookNode) {
        if (!currentComponent.hookNode) {
            currentComponent.hookNode = {
                data: defaultValue
            }
        }
        currentContext.hookNode = currentComponent.hookNode
    } else {
        // if not empty return or initialize next node
        if (!currentContext.hookNode.next) {
            currentContext.hookNode.next = {
                data: defaultValue
            }
        }
        currentContext.hookNode = currentContext.hookNode.next
    }

    return currentContext.hookNode
}

export function useState<T>(initialValue?: T): UseStateTuple<T> {
    // const currentContext = FncContext.current
    const currentComponent = FncContext.current.component

    // get or initialize current hook node from current component
    const curHookNode = getOrInitHookNode(initialValue)

    return [
        curHookNode.data,
        (val) => {
            curHookNode.data = val
            if (currentComponent.__internal.rendering)
                // defer immediate updates until render function has returned (batching)
                currentComponent.__internal.dirty = true
            else {
                currentComponent.__updater.scheduleUpdate(currentComponent)
            }
        }
    ]
}

export type EffectFn = () => (Function | void)

type UseEffectState ={
    cleanup?: Function,
    deps?: Array<any>
}
export function useEffect(effect: EffectFn, deps?: Array<any>) {
    const currentComponent = FncContext.current.component
    const [state, setState] = useState<UseEffectState>({cleanup: undefined, deps: undefined})
    if (state.cleanup) {
        state.cleanup()
    }
    let shouldRun = true
    if (state.deps) {
        if (deps.length !== state.deps.length) {
            shouldRun = false
        } else {
            shouldRun = false
            for (let i = 0; i < deps.length; i++) {
                if (deps[i] !== state.deps[i]) {
                    shouldRun = true
                    break
                }
            }
        }
    }
    let cleanup: any
    if (shouldRun) {
        cleanup = effect()
        currentComponent._cleaners = currentComponent._cleaners.filter(cl => cl !== state.cleanup)
        if (typeof cleanup === "function")
            currentComponent._cleaners.push(cleanup)
    }
    setState({deps, cleanup})
}

export function useUnsafeThis() {
    return FncContext.current.component
}

